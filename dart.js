var players = [];
var active_player = null;
window.addEventListener('load', generate_buttons());

function generate_buttons() {
    add_player();
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
    console.log(multiplier)
    if(active_player.round_score.split('-').length >3){
        minus_score = active_player.round_score.split('-').reduce(function (previous, current) {
            return previous - current;
        }, 0);;
        active_player.score = (parseInt(active_player.score) + minus_score).toString()
        active_player.round_score = ''
    }
    active_player.round_score = active_player.round_score + '-' + (parseInt(this.innerHTML) * multiplier).toString()
    select_multiplier(document.getElementById('single_multiplier'))
    update_players_gui()

}


function add_player() {
    _name = prompt("Please enter your name", "player" + players.length);
    new_player = { name: _name, score: '301', round_score: '' };
    players.push(new_player);
    update_players_gui()
}

function update_players_gui() {
    players_container = document.getElementById('players_container');
    while (players_container.children.length > 1) {
        players_container.deleteRow(1);
    }
    players.forEach((player) => {
        new_player = document.createElement('TR');
        new_player.id = player.name;
        player_name = document.createElement('TD');
        player_round_score_container = document.createElement('TD');
        player_score = document.createElement('TD');
        player_round_score = document.createElement('input');
        player_round_score.addEventListener('change', change_scrore);
        player_name.innerHTML = player.name;
        if(player.active){
            new_player.classList.add('active_player')
        }
        player_round_score.value = player.round_score;
        minus_score = player.round_score.split('-').reduce(function (previous, current) {
            return previous - current;
        }, 0);
        player_score.innerHTML = player.score + ', ' + (parseInt(player.score) + minus_score).toString();
        player_round_score_container.appendChild(player_round_score);
        new_player.appendChild(player_name);
        new_player.appendChild(player_round_score_container);
        new_player.appendChild(player_score);
        players_container.appendChild(new_player);

    });
    resolve_players_turn();
}

function change_scrore() {
    players.forEach((player) => {
        if (player.name === (this.parentNode.previousSibling.innerHTML)) {
            player.round_score = this.value
        }
    })
    update_players_gui();
}

function saveItem(name, value) {
    localStorage.setItem(name, JSON.stringify(value))
}

function readItem(name) {
    return localStorage[name];
}

function resetPlayers() {
    players = [];
    update_players_gui();
}

function resolve_players_turn() {
    if(active_player == null){
        active_player = players[0];
        document.getElementById('players_container').children[1].classList.add('active_player')
    }
    if(active_player.round_score.split('-').length > 3){
        active_player.active = false
        if(players.indexOf(active_player) == players.length -1 ){
            active_player = players[0];
        }else{
            active_player = players[players.indexOf(active_player) + 1];
        }
    }
    active_player.active = true;
    console.log(active_player)
}

function select_multiplier(button){
    document.getElementsByClassName('selected_multipler')[0].classList.remove('selected_multipler');
    button.classList.add('selected_multipler');
}