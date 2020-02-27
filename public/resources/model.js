// Model
let players = [];
let activePlayer;
let gameRound = 1;
let multiplier = 1;
let gamePoints = 301;
let gameMode = 'DoubleOut'
let xhr = new XMLHttpRequest();

function playerThrow(multiplier, hitNumber) {
    resolvePlayersTurn();
    console.log(players)
    if (gameMode == 'DoubleOut') {
        resolveDoubleOut(activePlayer, multiplier, hitNumber, gameRound)
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

function removePlayer(player){
    players.slice(players.indexOf(player),1)
}

function resetGame(_gameMode, _gamePoints) {
    players.forEach((player) =>{
        player.score = gamePoints;
        player.matchRound = { 1: { throws: [] } }
    });
    activePlayer = null;
    gameRound = 1;
    multiplier = 1;
    gamePoints = gamePoints;
    gameMode = _gameMode
}

function getRemainingPointsDoubleOut(player) {
    let summ = 0;
    for (let i = 1; i <= gameRound; i++) {
        if (player.matchRound[i] != null) {
            if (player.matchRound[i].busted) {
                continue;
            }
            summ = summ + player.matchRound[i].throws.reduce(function (previous, current) {
                if(typeof(current.hitNumber) === "number"){
                    return previous + current.hitNumber * current.multiplier;
                    
                }
                return 0;
            }, 0);
        }
    }
    return player.score - summ;
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

function resolveDoubleOut(player, multiplier, hitNumber, round) {
    player.matchRound[round].throws.push({"multiplier": multiplier, "hitNumber": hitNumber});
    remain = getRemainingPointsDoubleOut(player);
    if(multiplier == 2 && remain == 0){
        finishGame(activePlayer)
    }else if (remain <= 0) {
        player.matchRound[round].busted = true;
    }
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
});

async function showNumber(nr){
    const delay = ms => new Promise(res => setTimeout(res, ms));
    overlay = document.getElementById('overlay');
    overlay.children[0].innerHTML = nr.toString();
    overlay.style.display = "block";
    await delay(500);
    overlay.style.display = "none";
}
function generateButtons() {
    let buttonContainer = document.getElementById('buttonContainer');
    for (let i = 1; i <= 20; i++) {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.addEventListener('click', function () {
            playerThrow(multiplier, i)
            showNumber(i)
        })
        buttonContainer.appendChild(btn);
    }
    [25, 0,'Holz'].forEach(i => {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = i.toString();
        btn.id = i.toString();
        btn.addEventListener('click', function () {
            showNumber(i)
            playerThrow(multiplier, i)
        })
        buttonContainer.appendChild(btn);
    });

}

function updatePlayersGui() {
    playersContainer = document.createElement('tbody');
    players.forEach((player) => {
        let newPlayer = document.createElement('tr');
        if (player == activePlayer) {
            newPlayer.classList.add('activePlayer');
        }
        let playerAvatar = document.createElement('img');
        if(player.img != null){
            playerAvatar.src = player.img.result;
        }else{
            playerAvatar.src = 'resources/user.png';
        }
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
            registerGui(player.name, imgInput.files[0]);
            let reader = new FileReader();
            reader.onload = function (e) {
                player.img = e.target
                playerAvatar.src = player.img.result;
            }
            reader.readAsDataURL(imgInput.files[0]);
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
        document.getElementById("25").style.visibility = "";
    }
    multiplier = 1;
    if (btn.innerHTML == 'Double') {
        multiplier = 2;
    }
    if (btn.innerHTML == 'Tripple') {
        multiplier = 3;
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

function postData(url, data) {
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && parseInt(xhr.status) < 400) {
            return JSON.parse(xhr.responseText);
        }
    };
    xhr.send(data);
}

function registerGui(name, avatar) {
    // let data = {};
    // data.name = name;
    // data.avatar = avatar;
    // console.log(data)
    // console.log(postData("/api/register", data))
    let fd = new FormData();
    fd.enctyp = "multipart/form-data"
    fd.append("name", name);
    fd.append("avatar", avatar);
    xhr.open("POST", "/api/register", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && parseInt(xhr.status) < 400) {
            console.log(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(fd);
}

function finishGameGui(winner) {
    console.log(postResults("/api/results", JSON.stringify({ "players": JSON.stringify(players), "gameRound": gameRound, "gamePoints": gamePoints, "gameMode": gameMode })));
    alert(winner + " won the game");
    resetGameGui();
}