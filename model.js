// Model
let players = [];
let activePlayer;
let gameRound = 1;
let multiplier = 1;
let gamePoints = 301;
let gameMode = 'DoubleOut'

function playerThrow(multiplier, hitNumber,busted) {
    resolvePlayersTurn();
    if (gameMode == 'DoubleOut'){
        resolveDoubleOut(activePlayer, multiplier, hitNumber, gameRound, busted)
    }else{
        console.log('game is not implemented yet');
    }
    // game result show
    updatePlayersGui();
    resetMultiplier();
}

function addPlayer(_name) {
    let newPlayer = { name: _name, score: gamePoints, matchRound: {1: {throws: []}} };
    players.push(newPlayer);
}

function resetGame(_gameMode, _gamePoints) {
    players = [];
    activePlayer = null;
    gameRound = 1;
    multiplier = 1;
    gamePoints = gamePoints;
    gameMode = _gameMode
}

function getRemainingPointsDoubleOut(player, currentPoint){
    let summ = 0;
    for(let i = 1; i <= gameRound; i++){
        if(player.matchRound[i] != null){
            if(player.matchRound[i].busted){
                continue;
            }
            summ = summ + player.matchRound[i].throws.reduce(function (previous, current){
                return previous + current;
            }, 0 );
        }
    }
    console.log(player.score, summ, currentPoint)
    return player.score - summ - currentPoint;
}

function resolvePlayersTurn(){
    if(activePlayer == null){
        activePlayer = players[0];
    }
    if(activePlayer.matchRound[gameRound].throws.length > 2){
        if(players.indexOf(activePlayer) == players.length -1 ){
            gameRound += 1;
            activePlayer = players[0];
            players.forEach(player =>{
                player.matchRound[gameRound] = {throws:[]}
            })
        }else{
            activePlayer = players[players.indexOf(activePlayer) + 1];
        }
    }
}

function sortPlayers(player, position){
    players.splice(position, 0, players.splice(players.indexOf(player), 1)[0]);
}

function resolveDoubleOut(player,multiplier, hitNumber, round, busted){
    if (Boolean(busted)){
        bustedDoubleOut(player, round)
    }else{
        remain = getRemainingPointsDoubleOut(player, hitNumber * multiplier);
        if(remain >= 2){
            player.matchRound[round].throws.push(hitNumber * multiplier);
        } else if(multiplier != 2 || remain != 0){
            bustedDoubleOut(player, round)
        }else {
            alert(activePlayer.name + ' won the game')
        }
    }
}

function bustedDoubleOut(player,round){
    player.matchRound[round].busted = true;
}

function getCurrentPoints(player){
    if(gameMode == 'DoubleOut'){
        return getRemainingPointsDoubleOut(player,0)
    }
}

function changePlayerCertainPoint(player, cerRound, cerThrow, point){
    player.matchRound[cerRound].throws[cerThrow] = point;
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
    playersContainer = document.createElement('tbody');
    players.forEach((player) => {
        newPlayer = document.createElement('tr');
        if(player == activePlayer){
            newPlayer.classList.add('activePlayer');
        }
        playerName = document.createElement('td');
        playerName.innerHTML = player.name;
        playerScore = document.createElement('td');
        playerScore.innerHTML = getCurrentPoints(player);
        newPlayer.appendChild(playerName);
        newPlayer.appendChild(playerScore);
        for(let i = gameRound;i > 0; i--){
            if(i<gameRound-2){
                continue
            }
            roundColum = document.createElement('td');
            roundDiv = document.createElement('div');
            roundColum.appendChild(roundDiv);
            roundDiv.classList.add('columnContainer')
            for(let j=0; j < player.matchRound[i].throws.length; j++){
                scoreButton = document.createElement('BUTTON');
                scoreButton.innerHTML = player.matchRound[i].throws[j];
                scoreButton.addEventListener('click', ()=> {
                    changePlayerCertainPoint(player, i, j, prompt("Change Score?", player.matchRound[i].throws[j]));
                    scoreButton.innerHTML = player.matchRound[i].throws[j]
                });
                roundDiv.appendChild(scoreButton)
            }
            newPlayer.appendChild(roundColum);
        }
        if(player.active){
            newPlayer.classList.add('activePlayer');
        }
        playersContainer.appendChild(newPlayer);

    });
    container = document.getElementById('playersContainer');
    container.innerHTML = '';
    container.appendChild(playersContainer);
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

function resetGameGui(){
    resetGame('DoubleOut',parseInt(prompt('Point to sattle:', 301)))
    updatePlayersGui()
}

function addPlayerGui(){
    addPlayer(prompt("Please enter your name", "new Player"));
    updatePlayersGui();
}