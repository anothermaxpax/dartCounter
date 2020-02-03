// Model
let players = [];
let activePlayer;
let round = 1;
let multiplier = 1;
let startingPoints = 301;
let gameMode = 'DoubleOut'

function playerThrow(multiplier, hitNumber,busted) {
    resolvePlayersTurn();
    if (gameMode == 'DoubleOut'){
        resolveDoubleOut(activePlayer, multiplier, hitNumber,busted)
    }else{
        console.log('game is not implemented yet');
    }
    // game result show
    updatePlayersGui();
    resetMultiplier();
}

function addPlayer(_name) {
    let newPlayer = { name: _name, score: startingPoints, throws: [] };
    players.push(newPlayer);
}

function resetGame(_gameMode, _startingPoints) {
    players = [];
    activePlayer = null;
    round = 1;
    multiplier = 1;
    startingPoints = startingPoints;
    gameMode = _gameMode
}

function getRemainingPoints(player, currentPoint){
    return player.score + player.throws.reduce(function (previous, current){
        return previous - current;
    }, 0 ) - currentPoint;
}

function resolvePlayersTurn(){
    if(activePlayer == null){
        activePlayer = players[0];
    }
    if(Math.floor(activePlayer.throws.length / 3) >= round){
        if(players.indexOf(activePlayer) == players.length -1 ){
            round += 1;
            activePlayer = players[0];
        }else{
            activePlayer = players[players.indexOf(activePlayer) + 1];
        }
    }
}

function sortPlayers(player, position){
    players.splice(position, 0, players.splice(players.indexOf(player), 1)[0]);
}

function resolveDoubleOut(player,multiplier, hitNumber, busted){
    if (Boolean(busted)){
        bustedDoubleOut(player)
    }else{
        remain = getRemainingPoints(player, hitNumber * multiplier);
        if(remain >= 2){
            player.throws.push(hitNumber * multiplier);
        } else if(multiplier != 2 || remain != 0){
            bustedDoubleOut(player)
        }else {
            alert(activePlayer.name + ' won the game')
        }
    }
}

function bustedDoubleOut(player){
    let i;
    for(i = 0; i < 3; i++){
        player.throws[(round - 1) * 3 + i] = 0;
    }
}

// Design and Controller

window.addEventListener('load', ()=>{
    generateButtons();
    addPlayerGui();
});

function generateButtons() {
    let buttonContainer = document.getElementById('buttonContainer');
    for (let i = 1; i <= 20; i++) {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.addEventListener('click', function (){
            playerThrow(multiplier,i)
        })
        buttonContainer.appendChild(btn);
    }
    [25,50,0].forEach(i =>{
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.addEventListener('click', function (){
            playerThrow(multiplier,i)
        })
        buttonContainer.appendChild(btn);
    });
    let btn = document.createElement("BUTTON");
    btn.innerHTML = 'busted';
    btn.addEventListener('click', function (){
        playerThrow(multiplier,0, true)
    })
    buttonContainer.appendChild(btn);

}

function updatePlayersGui() {
    if(activePlayer == null){
        activePlayer = players[0];
    }
    playersContainer = document.getElementById('playersContainer');
    playersContainer.innerHTML = '';
    players.forEach((player) => {
        newPlayer = document.createElement('DIV');
        if(player == activePlayer){
            newPlayer.classList.add('activePlayer');
        }
        newPlayer.id = player.name;
        playerName = document.createElement('LABEL');
        playerScore = document.createElement('LABEL');
        playerScoreContainer = document.createElement('DIV');
        playerScoreContainer.classList.add('scoreContainer');
        createScoreTable(player, playerScoreContainer)
        playerName.innerHTML = player.name;
        if(player.active){
            newPlayer.classList.add('activePlayer');
        }
        minusScore = player.throws.reduce(function (previous, current) {
            return previous - current;
        }, 0);
        playerScore.innerHTML = player.score + minusScore;
        newPlayer.appendChild(playerName);
        newPlayer.appendChild(playerScore);
        newPlayer.appendChild(playerScoreContainer);
        playersContainer.appendChild(newPlayer);

    });
}

function selectMultiplier(btn){
    let oldMult = document.getElementById('selectedMultipler');
    if(oldMult !== btn){
        oldMult.id = '';
        btn.id = 'selectedMultiplier';
    }
    multiplier = 1;
    if (btn.innerHTML == 'Double'){
        multiplier = 2;
    }
    if (btn.innerHTML == 'Tripple'){
        multiplier = 3;
    }
    
    
}

function resetMultiplier(){
    multiplier = 1;
    let x = document.getElementById('multipler').children[0]
    selectMultiplier(document.getElementById('multipler').children[0])
}

function createScoreTable(player, scoreContainer){
    let i ;
    for(i = 0;i < round;i++){
        row = document.createElement('DIV');
        row.classList.add('parent');
        let x = (i == round -1 )? player.throws.length - (round - 1) *3 : 3;
        for(let j=0; j < x; j++){
            scoreButton = document.createElement('BUTTON');
            scoreButton.innerHTML = player.throws[i*3 + j];
            scoreButton.addEventListener('click', ()=> {
                changePlayerCertainPoint(prompt("Change Score?", scoreButton.innerHTML), i);
                scoreButton.innerHTML = player.throws[i*3 + j]
            });
            row.appendChild(scoreButton)
        }
        scoreContainer.appendChild(row);
    }
}

function resetGameGui(){
    resetGame('DoubleOut',parseInt(prompt('Point to sattle:', 301)))
    updatePlayersGui()
}

function addPlayerGui(){
    addPlayer(prompt("Please enter your name", "new Player"));
    updatePlayersGui();
}