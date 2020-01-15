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
    players_container=document.getElementById('players_container');
    number_of_players = players_container.children.length;
    console.log(number_of_players)
    new_player = document.createElement('DIV')
    new_player.id='player' + number_of_players.toString()
    new_player.classList.add('player_container')
    player_label = document.createElement('DIV')
    player_label.innerHTML='Player' + number_of_players.toString()
    player_score=document.createElement('DIV')
    player_score.innerHTML='301'
    new_player.appendChild(player_label)
    new_player.appendChild(player_score)
    players_container.appendChild(new_player)
    console.log('add player done')
}

