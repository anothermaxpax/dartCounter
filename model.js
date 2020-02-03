// Model
let players = [];
let active_player;
let round = 1;
let multiplier = 1;
let starting_points = 301;
let gameMode = 'DoubleOut'

function playerThrow(multiplier, hitNumber) {
    resolvePlayersTurn();
    if (gameMode == 'DoubleOut'){
        resolveDoubleOut(active_player, multiplier, hitNumber)
    }else{
        console.log('game is not implemented yet');
    }
    // game result show
    updatePlayersGui();
    resetMultiplier();
}

function add_player(_name) {
    new_player = { name: _name, score: starting_points, throws: [] };
    players.push(new_player);
}

function resetGame(_gameMode, _starting_points) {
    players = [];
    active_player = null;
    round = 1;
    multiplier = 1;
    starting_points = starting_points;
    gameMode = _gameMode
}

function getRemainingPoints(player, currentPoint){
    return player.score + player.throws.reduce(function (previous, current){
        return previous - current;
    }, 0 ) - currentPoint;
}

function resolvePlayersTurn(){
    if(active_player == null){
        active_player = players[0];
    }
    if(Math.floor(active_player.throws.length / 3) >= round){
        if(players.indexOf(active_player) == players.length -1 ){
            round += 1;
            active_player = players[0];
        }else{
            active_player = players[players.indexOf(active_player) + 1];
        }
    }
}

function sortPlayers(player, position){
    players.splice(position, 0, players.splice(players.indexOf(player), 1)[0]);
}

function resolveDoubleOut(player,multiplier, hitNumber, busted){
    if (Boolean(busted)){

    }
    remain = getRemainingPoints(player, hitNumber * multiplier);
    if(remain >= 2){
        player.throws.push(parseInt(this.innerHTML) * multiplier);
    } else if(multiplier != 2 || remain != 0){
        bustedDoubleOut(player)
    }else {
        alert(active_player.name + ' won the game')
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
    add_player(prompt("Please enter your name", "new Player"));
    generateButtons()
    updatePlayersGui();
});

function generateButtons() {
    let button_container = document.getElementById('buttonContainer');
    for (let i = 1; i <= 20; i++) {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.addEventListener('onClick', playerThrow(multiplier,i))
        buttonContainer.appendChild(btn);
    }
    [25,50,0].forEach(i =>{
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.addEventListener('onClick', playerThrow(multiplier,i))
        button_container.appendChild(btn);
    });
    let btn = document.createElement("BUTTON");
    btn.innerHTML = 'busted';
    btn.addEventListener('onClick', playerThrow(multiplier,0, true))
    button_container.appendChild(btn);

}

function updatePlayersGui() {
    if(active_player == null){
        active_player = players[0];
    }
    players_container = document.getElementById('players_container');
    players_container.innerHTML = '';
    players.forEach((player) => {
        new_player = document.createElement('DIV');
        if(player == active_player){
            new_player.classList.add('active_player');
        }
        new_player.classList.add('vertical_container');
        new_player.id = player.name;
        player_name = document.createElement('LABEL');
        player_score = document.createElement('LABEL');
        player_score_container = document.createElement('DIV');
        player_score_container.classList.add('vertical_container');
        player_score_container.classList.add('colum_reverse');
        let i ;
        for(i = 0;i < round;i++){
            row = document.createElement('DIV');
            row.classList.add('score_container');
            let x = (i == round -1 )? player.throws.length - (round - 1) *3 : 3
            let j;
            for(j=0;j< x;j++){
                score_button = document.createElement('BUTTON');
                score_button.innerHTML = player.throws[i*3 + j];
                score_button.addEventListener('click', ()=> {
                    score_button.innerHTML = prompt("Change Score?", score_button.innerHTML);
                    update_players_gui();
                });
                row.appendChild(score_button)
            }
            player_score_container.appendChild(row);
        }      
        player_name.innerHTML = player.name;
        if(player.active){
            new_player.classList.add('active_player')
        }
        minus_score = player.throws.reduce(function (previous, current) {
            return previous - current;
        }, 0);
        player_score.innerHTML = player.score + minus_score;
        new_player.appendChild(player_name);
        new_player.appendChild(player_score);
        new_player.appendChild(player_score_container);
        players_container.appendChild(new_player);

    });
}

function selectMultiplier(btn){
    let oldMult = document.getElementById('selectedMultipler');
    if(oldMult !== btn){
        oldMult.id = '';
        btn.id = 'selected_multiplier';
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
    console.log(x)
    selectMultiplier(document.getElementById('multipler').children[0])
}