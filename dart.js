var players = [];
var active_player = null;
var round = 1;
var starting_points = 301;
window.addEventListener('load', generate_buttons());

function generate_buttons() {
    resetPlayers();
    var i;
    button_container = document.getElementById('button_container');
    for (i = 0; i < 4; i++) {
        row_container = document.createElement('DIV');
        row_container.classList.add('container');

        for (j = 1; j <= 5; j++) {
            var btn = document.createElement("BUTTON");
            btn.innerHTML = (i * 5 + j).toString();
            btn.addEventListener('click', throw_dart)
            btn.classList.add('myButton')
            row_container.appendChild(btn);
        }
        button_container.appendChild(row_container);
    }
    row_container = document.createElement('DIV');
    row_container.classList.add('container');
    [25,50,0].forEach(i =>{
        var btn = document.createElement("BUTTON");
        btn.innerHTML = (i).toString();
        btn.addEventListener('click', throw_dart)
        btn.classList.add('myButton')
        row_container.appendChild(btn);
    });
    button_container.appendChild(row_container);

}

function throw_dart() {
    multiplier = 3;
    if(document.getElementsByClassName('selected_multipler')[0].innerHTML === 'Single'){
        multiplier = 1;
    }else if(document.getElementsByClassName('selected_multipler')[0].innerHTML === 'Double'){
        multiplier = 2;
    }
    if(Math.floor(active_player.throws.length / 3) >= round){
        if(players.indexOf(active_player) == players.length -1 ){
            round += 1;
            active_player = players[0];
        }else{
            active_player = players[players.indexOf(active_player) + 1];
        }
    }
    remain = active_player.score + active_player.throws.reduce(function (previous, current) {
        return previous - current;
    }, 0) - parseInt(this.innerHTML) * multiplier;
    
    if(remain >= 2){
        active_player.throws.push(parseInt(this.innerHTML) * multiplier);
    } else if(multiplier != 2 || remain != 0){
        var i;
        for(i = 0; i < 3; i++){
            active_player.throws[(round - 1) * 3 + i] = 0;
            
        }
    }else {
        alert(active_player.name + ' won the game')
        round = 1;
        players.forEach((player)=> {
            player.throws = [];
            player.score = starting_points;
            console.log(player)
        })        
    }
    select_multiplier(document.getElementById('single_multiplier'))
    update_players_gui()
}



function add_player() {
    _name = prompt("Please enter your name", "player" + players.length);
    new_player = { name: _name, score: starting_points, throws: [] };
    players.push(new_player);
    update_players_gui()
}

function update_players_gui() {
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
        var i ;
        for(i = 0;i < round;i++){
            row = document.createElement('DIV');
            row.classList.add('score_container');
            var x = (i == round -1 )? player.throws.length - (round - 1) *3 : 3
            var j;
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

function saveItem(name, value) {
    localStorage.setItem(name, JSON.stringify(value))
}

function readItem(name) {
    return localStorage[name];
}

function resetPlayers() {
    players = [];
    starting_points = parseInt(prompt("Please enter your goal Score", starting_points));
    add_player();
    update_players_gui();
}

function resolve_players_turn() {
    if(active_player.throws.length % 3 == 0){
        
    }
}

function select_multiplier(button){
    document.getElementsByClassName('selected_multipler')[0].classList.remove('selected_multipler');
    button.classList.add('selected_multipler');
}