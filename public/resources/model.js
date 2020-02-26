// Model
let players = [];
let activePlayer;
let gameRound = 1;
let multiplier = 1;
let gamePoints = 301;
let gameMode = 'DoubleOut'
let xhr = new XMLHttpRequest();

function playerThrow(multiplier, hitNumber, busted) {
    resolvePlayersTurn();
    if (gameMode == 'DoubleOut') {
        resolveDoubleOut(activePlayer, multiplier, hitNumber, gameRound, busted)
    } else {
        console.log('game is not implemented yet');
    }
    // game result show
    updatePlayersGui();
    resetMultiplier();
}

function addPlayer(_name) {
    let newPlayer = { name: _name, score: gamePoints, matchRound: { 1: { throws: [] } } };
    players.push(newPlayer);
    resolvePlayersTurn();
}

function resetGame(_gameMode, _gamePoints) {
    players = [];
    activePlayer = null;
    gameRound = 1;
    multiplier = 1;
    gamePoints = gamePoints;
    gameMode = _gameMode
}

function getRemainingPointsDoubleOut(player, currentPoint) {
    let summ = 0;
    for (let i = 1; i <= gameRound; i++) {
        if (player.matchRound[i] != null) {
            if (player.matchRound[i].busted) {
                continue;
            }
            summ = summ + player.matchRound[i].throws.reduce(function (previous, current) {
                return previous + current;
            }, 0);
        }
    }
    return player.score - summ - currentPoint;
}

function resolvePlayersTurn() {
    if (activePlayer == null) {
        activePlayer = players[0];
    }
    if (activePlayer.matchRound[gameRound].throws.length > 2 || activePlayer.matchRound[gameRound].busted) {
        if (players.indexOf(activePlayer) == players.length - 1) {
            gameRound += 1;
            activePlayer = players[0];
            players.forEach(player => {
                player.matchRound[gameRound] = { throws: [] }
            })
        } else {
            activePlayer = players[players.indexOf(activePlayer) + 1];
        }
    }
}

function sortPlayers(player, position) {
    players.splice(position, 0, players.splice(players.indexOf(player), 1)[0]);
}

function resolveDoubleOut(player, multiplier, hitNumber, round, busted) {
    if (Boolean(busted)) {
        bustedDoubleOut(player, round)
    } else {
        remain = getRemainingPointsDoubleOut(player, hitNumber * multiplier);
        if (remain >= 2) {
            player.matchRound[round].throws.push(hitNumber * multiplier);
        } else if (multiplier != 2 || remain != 0) {
            bustedDoubleOut(player, round)
        } else {
            player.matchRound[round].throws.push(hitNumber * multiplier);
            finishGame(activePlayer)
        }
    }
}

function bustedDoubleOut(player, round) {
    player.matchRound[round].busted = true;
}

function getCurrentPoints(player) {
    if (gameMode == 'DoubleOut') {
        return getRemainingPointsDoubleOut(player, 0)
    }
}

function changePlayerCertainPoint(player, cerRound, cerThrow, point) {
    player.matchRound[cerRound].throws[cerThrow] = point;
}

function finishGame(winner) {
    finishGameGui(winner.name);
}

// Design and Controller

window.addEventListener('load', () => {
    generateButtons();
    addPlayerGui();
    registerGui();
});

function generateButtons() {
    let buttonContainer = document.getElementById('buttonContainer');
    for (let i = 1; i <= 20; i++) {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.addEventListener('click', function () {
            playerThrow(multiplier, i)
        })
        buttonContainer.appendChild(btn);
    }
    [25, 50, 0].forEach(i => {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.id = i.toString();
        btn.addEventListener('click', function () {
            playerThrow(multiplier, i)
        })
        buttonContainer.appendChild(btn);
    });
    let btn = document.createElement("BUTTON");
    btn.innerHTML = 'busted';
    btn.addEventListener('click', function () {
        playerThrow(multiplier, 0, true)
    })
    buttonContainer.appendChild(btn);

}

function updatePlayersGui() {
    playersContainer = document.createElement('tbody');
    players.forEach((player) => {
        let newPlayer = document.createElement('tr');
        if (player == activePlayer) {
            newPlayer.classList.add('activePlayer');
        }
        let playerAvatar = document.createElement('img');
        playerAvatar.src = 'resources/user.png';
        playerAvatar.classList.add("playerAvatar")
        let playerName = document.createElement('p');
        playerName.classList.add("topMid");
        playerName.draggable = true;
        playerName.addEventListener("dragstart", dragStart)
        newPlayer.addEventListener("dragEnter", dragOver)
        newPlayer.addEventListener("ondrop", drop)
        playerName.innerHTML = player.name;
        let imgInput = document.createElement('input');
        imgInput.type = 'file';
        imgInput.accept = 'image/*';
        imgInput.addEventListener("change", () => {
            let reader = new FileReader();
            reader.onload = function (e) {
                playerAvatar.src = e.target.result;
            }
            reader.readAsDataURL(imgInput.files[0]);
            registerGui(player.name, imgInput.files[0]);
        })
        imgInput.style.visibility = "hidden";
        playerAvatar.onclick = () => {
            imgInput.click();
        }
        divAvatar = document.createElement("div");
        divAvatar.style.position = "relative";
        divAvatar.style["text-align"] = "center";
        divAvatar.appendChild(playerName);
        divAvatar.appendChild(playerAvatar);
        tdAvatar = document.createElement('td');
        tdAvatar.appendChild(divAvatar);
        newPlayer.appendChild(tdAvatar);

        let playerScore = document.createElement('td');
        playerScore.innerHTML = getCurrentPoints(player);
        newPlayer.appendChild(playerScore);
        for (let i = gameRound; i > 0; i--) {
            if (i < gameRound - 2) {
                continue
            }
            let roundColum = document.createElement('td');
            let roundDiv = document.createElement('div');
            roundColum.appendChild(roundDiv);
            roundDiv.classList.add('columnContainer')
            for (let j = 0; j < player.matchRound[i].throws.length; j++) {
                let scoreButton = document.createElement('BUTTON');
                if (player.matchRound[i].busted) {
                    scoreButton.innerHTML = "<del>" + player.matchRound[i].throws[j].toString() + "</del>";
                } else {
                    scoreButton.innerHTML = player.matchRound[i].throws[j];
                }
                scoreButton.addEventListener('click', () => {
                    changePlayerCertainPoint(player, i, j, parseInt(prompt("Change Score?", player.matchRound[i].throws[j])))
                    scoreButton.innerHTML = player.matchRound[i].throws[j].toString();
                });
                roundDiv.appendChild(scoreButton)
            }
            newPlayer.appendChild(roundColum);
        }
        if (player.active) {
            newPlayer.classList.add('activePlayer');
        }
        playersContainer.appendChild(newPlayer);

    });
    container = document.getElementById('playersContainer');
    container.innerHTML = '';
    container.appendChild(playersContainer);
}

function selectMultiplier(btn) {
    let oldMult = document.getElementById('selectedMultiplier');
    if (oldMult !== btn) {
        oldMult.id = '';
        btn.id = 'selectedMultiplier';
        document.getElementById("50").style.visibility = "";
        document.getElementById("25").style.visibility = "";
    }
    multiplier = 1;
    if (btn.innerHTML == 'Double') {
        multiplier = 2;
        document.getElementById("50").style.visibility = "hidden";
    }
    if (btn.innerHTML == 'Tripple') {
        multiplier = 3;
        document.getElementById("50").style.visibility = "hidden";
        document.getElementById("25").style.visibility = "hidden";
    }
}

function resetMultiplier() {
    selectMultiplier(document.getElementById('multipler').children[0])
}

function resetGameGui() {
    resetGame('DoubleOut', parseInt(prompt('Point to sattle:', 301)))
    updatePlayersGui()
}

function addPlayerGui() {
    addPlayer(prompt("Please enter your name", "new Player"));
    updatePlayersGui();
}

function dragStart(event) {
    event.target.classList.add("draggingElement")
    console.log("drag Started")
    console.log(event.target)
}

function dragOver(event) {
    event.preventDefault();
    console.log("dragOver", event)
    dragElemetnt = document.getElementsByClassName("draggingElement")[0].parentElement;
    tableElement = dragElemetnt.parentNode;
    console.log(tableElement)
}

function drop(event) {
    console.log("drop", event)
}

function postResults() {
    xhr.open("POST", "http://" + window.location.hostname + "/api/results", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && parseInt(xhr.status) < 400) {
            res = JSON.parse(xhr.responseText);
        }
    };
    data = JSON.stringify({ "players": JSON.stringify(players), "gameRound": gameRound, "gamePoints": gamePoints, "gameMode": gameMode });
    xhr.send(data);
}

function registerGui(name, image) {
    let fd = new FormData();
    console.log(fd)
    // fd.append("avatar", image);
    fd.append("name", "mystuff");
    console.log(fd)
    // fetch('/api/register', {
    //     method: 'Post',
    //     body: fd
    // })
    // .then(res => res.json())
    // .then(json => console.log(json))
    // .catch(err => console.error(err));
    
}

function finishGameGui(winner) {
    postResults()
    alert(winner + " won the game");
    resetGameGui();
}