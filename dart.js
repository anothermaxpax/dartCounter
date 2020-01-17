window.addEventListener('load', generate_buttons());

function generate_buttons(){
    add_player();
    selected_player=document.getElementById('player1')
    console.log('after add player')
    var i;
    button_container = document.getElementById('button_container');

    for(i=0; i<4; i++){
        row_container = document.createElement('DIV');
        row_container.classList.add('container');
        
        for(j=1;j<=5;j++){
            console.log('working');
            var btn = document.createElement("BUTTON");
            btn.innerHTML= (i*5+j).toString();
            btn.addEventListener('click',decrease_point)
            btn.classList.add('myButton')
            row_container.appendChild(btn);
        }
        button_container.appendChild(row_container);
    }

    

}

function decrease_point(){
    console.log('dcreasing pints')
    console.log(this)
    player_score=selected_player.children[1];
    player_score.innerHTML = parseInt(player_score.innerHTML) - parseInt(this.innerHTML)
}


function add_player(){
    if(readCookie('players') == null){
        setCookie('players', [])
    }
    players = readCookie('players');
    _name =  prompt("Please enter your name", "player" + players.length);
    new_player = {name:_name, score:'301'};
    players.push(new_player);
    setCookie('players',players);
    update_players_gui()
    console.log('adding player done')
}

function update_players_gui(){
    players_container=document.getElementById('players_container');
    while (players_container.firstChild) {
        players_container.removeChild(players_container.firstChild);
      }
    players=readCookie('players');
    for(player in players){
        console.log(player)
        new_player = document.createElement('DIV')
        new_player.id=player.name;
        new_player.classList.add('player_container')
        player_label = document.createElement('INPUT')
        player_label.value=player.name;
        player_score=document.createElement('INPUT')
        player_score.innerHTML=player.score;
        new_player.appendChild(player_label)
        new_player.appendChild(player_score)
        players_container.appendChild(new_player)
        console.log('add player done')
    }
}

function setCookie(name, value) {
    var cookie = [
        name,
        '=',
        JSON.stringify(value)
    ].join('');
    document.cookie = cookie;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return JSON.parse(
                c.substring(nameEQ.length, c.length)
            );
        }
    }
    return null;
}

function resetPlayers(){
    setCookie('players', []);
    update_players_gui()
}
