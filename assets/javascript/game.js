//global variables
var characters;
var gameState;

//Functions
//========================================
// Initilizes games and calls the functions to execute this
function startGame() {
    characters = characterChoices();
    gameState = resetGameState();
    renderCharacters();
}
function characterChoices() {
    return {
        'chewie': {
            name: 'Chewbacca',
            health: 100,
            attack: 10,
            counterAttack: 15,
            image: 'assets/images/chewbacca.jpg',
            sounds: new Audio('assets/sounds/chewieroar.mp3')

        },
        'boba': {
            name: 'Boba Fett',
            health: 130,
            attack: 12,
            counterAttack: 10,
            image: 'assets/images/bobafett.jpg'
        },
        'windu': {
            name: 'Mace Windu',
            health: 140,
            attack: 20,
            counterAttack: 8,
            image: 'assets/images/maceWindu.jpg'
        },
        'revan': {
            name: 'Darth Revan',
            health: 160,
            attack: 15,
            counterAttack: 25,
            image: 'assets/images/darthRevan.jpg'
        }
    }
}
function resetGameState(){
    return {
        selectedCharacter: null,
        selecetedDefender: null,
        enemiesLeft: 0,
        numAttacks: 0 
    }
}
function createCharDiv(character,key){
    var charDiv = $("<div class='character' data-name='" + key + "'>");
    var charName = $("<div class ='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr('src', character.image);
    var charHealth = $("<div class ='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    return charDiv;
}
function renderCharacters(){
    console.log('displaying characters')
    var keys = Object.keys(characters);
    for (var i = 0; i < keys.length; i++){
        var characterKey = keys[i];
        var character = characters[characterKey];
        var charDiv = createCharDiv(character, characterKey);
        $('#character-area').append(charDiv);
    }
}
function renderOpponents(selectedCharacterKey){
    var characterKeys = Object.keys(characters)
    for(var i = 0; i < characterKeys.length; i++){
        if(characterKeys[i] !== selectedCharacterKey){
        var enemyKey = characterKeys[i];
        var enemy = characters[enemyKey];
        var enemyDiv = createCharDiv(enemy, enemyKey);
        $(enemyDiv).addClass('enemy');
        $('#available-to-attack-section').append(enemyDiv);
        }
    }
}

function enableEnemySelection(){
    $('.enemy').on('click.enemySelect', function(){
        console.log('opponent selected');
        var opponentKey = $(this).attr('data-name')
        gameState.selectedDefender = characters[opponentKey];
        $('#defender').append(this);
        $('#attack-button').show();
        $('.enemy').off('click.enemySelect');
    })
}

function attack(numAttacks){
    console.log('attacking defender');
    
    gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numAttacks;
}
function defend(){
    console.log('defender counterattack');
    gameState.selectedCharacter.health -= gameState.selectedDefender.counterAttack;
}
function isCharacterDead(character){
    console.log('checking if player is dead');
    return character.health <= 0;
}
function gameWon(){
    console.log('checking if player won');
    var yoda = new Audio('assets/sounds/strongWithForce.mp3');
    yoda.play();
    return gameState.enemiesLeft === 0;
}
function isAttackPhaseComplete(){
    if (isCharacterDead(gameState.selectedCharacter)){
        alert('You were defeated by' + gameState.selectedDefender.name + '. Click reset to play again')
        $('#selected-character').empty();
        $('#reset-button').show();
        return true
    }else if (isCharacterDead(gameState.selectedDefender)){
        console.log('defender dead')
        gameState.enemiesLeft--;
            $('#defender').empty();
        if(gameWon()){
            alert('You Win! Press Reset to play again');
            $('#reset-button').show();
        }else{
            
            alert('You are defeated' + gameState.selectedDefender.name + '! Select another enemy to fight');
            enableEnemySelection();
        }
        return true
    }
    return false
}

function emptyDivs(){
    $('#selected-character').empty();
    $('#defender').empty();
    $('#available-to-attack-section .enemy').empty();
    $('#character-area').empty();
    $('#characters-section').show();
}
$(document).ready(function(){
    var theme = new Audio("assets/sounds/theme.mp3");
    theme.volume = .3;
    theme.play();
    $('#character-area').on('click', '.character', function(){
        var selectedKey = $(this).attr('data-name');
        gameState.selectedCharacter = characters[selectedKey];
        //var sound = selectedKey.sounds;
        //sound.play();
        console.log('player selected');
        $('#selected-character').append(this);
        renderOpponents(selectedKey);
        $('#characters-section').hide();
        gameState.enemiesLeft = Object.keys(characters).length - 1
        enableEnemySelection();        
    })
    $('#attack-button').on('click.attack', function(){
        console.log('attack clicked');
        gameState.numAttacks++;
        attack(gameState.numAttacks);
        defend();
        $('#selected-character .character-health').text(gameState.selectedCharacter.health);
        $('#defender .character-health').text(gameState.selectedDefender.health);
        if (isAttackPhaseComplete()){
            $(this).hide();
        }
    })
    $('#reset-button').on('click.reset', function(){
        console.log('restarting game');
        emptyDivs();
        $(this).hide();
        startGame();
    })
    startGame();  
})



