function startTTT() {  //create HTML items on document
    gameDiv.innerHTML = `<div id="score"> Your Current Score:
                                <div id="actual score"></div>
                        </div>
                        <div id="board">
                        </div>`
    gameDiv.classList.remove("hidden")
    music.pause()
    let buttons = document.querySelector("#game-buttons")
    buttons.classList.add("hidden")
    let logoutButton = document.querySelector("#logout")
    logoutButton.classList.add("hidden")
    let boardDiv = document.querySelector('#board')
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div')
        row.classList.add("row")
        row.setAttribute("row-id", i)
        boardDiv.append(row)
        for (let j = 0; j < 3; j++) {
            let tile = document.createElement('div')
            tile.setAttribute("col-id", j)
            tile.classList.add("tile")
            tile.classList.add("tac")
            row.append(tile)
        }
    }
    tiles = document.querySelectorAll('.tile')
    let quitButton = document.createElement("button")
    gameDiv.append(quitButton)
    quitButton.id = "quit-button"
    quitButton.textContent = "Quit Game"
    quitButton.removeEventListener("click", handleQuitTTT)
    quitButton.addEventListener("click", handleQuitTTT)
    fillScoresTTT()
    document.removeEventListener("click", handleTTTClick)
    document.addEventListener("click", handleTTTClick)
    fetchBoardTTT()
    fillRulesT()
}
function fetchBoardTTT() {
    fetch(`https://gameboyzarcade.herokuapp.com/users/${welcome.dataset.id}/nextgame/TicTacToe`)
        .then(r => r.json())
        .then(game => {
            gameDiv.dataset.id = game.id
            loadBoardTTT(game.board_state)
            loadScoreTTT(game.score)
        })
}
function loadBoardTTT(board) {  //render board (new or updated)
    board.forEach((row, i) => {
        let htmlRow = document.querySelector(`[row-id="${i}"]`)
        row.forEach((col, j) => {
            let htmlCol = htmlRow.querySelector(`[col-id="${j}"]`)
            htmlCol.textContent = col
            if (col == 0) {            //come in as numbers on new game, strings on loaded game -> hence == and not ===
                htmlCol.classList.add("empty")
            } else {
                htmlCol.classList.add("ocupado")
                if (col == String.fromCodePoint(10060)) {
                    htmlCol.classList.add("ex")
                } else {
                    htmlCol.classList.add("oh")
                }
            }
        })
    })
    blankZeroesTTT()
}
function loadScoreTTT(score) {
    htmlScore = document.querySelector('#score')
    htmlScore.firstElementChild.textContent = score
}
function incrementScoreTTT(score) {
    htmlScore = document.querySelector('#score')
    loadScoreTTT(parseInt(htmlScore.firstElementChild.textContent) + score)
}

function fillScoresTTT() {
    let scoresList = document.querySelector("#scores-list")
    scoresList.replaceChildren()
    scoresList.textContent = "TicTacToe Scores:"
    fetch(`https://gameboyzarcade.herokuapp.com/games/TicTacToe/leaderboard`)
        .then(r => r.json())
        .then(scores => {
            scores.forEach(score => {
                let li = document.createElement("li")
                li.textContent = score
                scoresList.append(li)
            })
        })
}

function fillRulesT() {
    fetch("https://gameboyzarcade.herokuapp.com/games/rules/TicTacToe")
        .then(r => r.text())
        .then(rule => {
            rules.textContent = rule
        })
}

function clearRulesT() {
    rules.textContent = ""
}

function handleTTTClick(event) {
    if (event.target.matches('.tile') && !event.target.classList.contains("ocupado")) {
        let tile = event.target
        placeTokenTTT("ex", tile)
    }
}

function handleQuitTTT() {
    saveTTT(true)
    document.removeEventListener("click", handleTTTClick)

    alert("Game Ended! (You quitter)")
    gameDiv.classList.add("hidden")
    music.play()

    let buttons = document.querySelector("#game-buttons")
    buttons.classList.remove("hidden")

    let logoutButton = document.querySelector("#logout")
    logoutButton.classList.remove("hidden")
    myScores(welcome.dataset.id)
    clearRulesT()
}
function handleGameOverTTT() {
    document.removeEventListener("click", handleTTTClick)

    gameDiv.classList.add("hidden")
    music.play()

    let buttons = document.querySelector("#game-buttons")
    buttons.classList.remove("hidden")

    let logoutButton = document.querySelector("#logout")
    logoutButton.classList.remove("hidden")
    myScores(welcome.dataset.id)
    clearRulesT()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function placeTokenTTT(token, tile) {
    tile.textContent = String.fromCodePoint(10060)  // ??? 
    tile.classList.remove("empty")
    tile.classList.add("ex")
    tile.classList.add("ocupado")
    blanks = document.querySelectorAll('.empty')
    sleep(700).then(() => { randOTTT() });
    blankZeroesTTT()
    incrementScoreTTT(-10)
}

function randOTTT() {
    if (blanks.length !== 0) {
        let randBlank = blanks[Math.floor(blanks.length * Math.random())]
        randBlank.textContent = String.fromCodePoint(11093)  // ???  
        randBlank.classList.remove("empty")
        randBlank.classList.add("oh")
        randBlank.classList.add("ocupado")
        blanks = document.querySelectorAll('.empty')
        blankZeroesTTT()
    }
    saveTTT()
}

function blankZeroesTTT() {
    tiles.forEach(tile => {
        if (tile.textContent === "0") {
            tile.classList.add("empty")
        } else {
            tile.style.backgroundColor = getColorTTT(tile.textContent)
        }
    })
    blanks = document.querySelectorAll('.empty')
}

function getColorTTT(val) {
    switch (val) {
        case String.fromCodePoint(10060): return "#42F5E3"
        case String.fromCodePoint(11093): return "#F3F781"
    }
}

function saveTTT(game_over = checkGameOverTTT()) {
    let id = gameDiv.dataset.id
    let board = [[], [], []]    // change for connect 4
    tiles.forEach(tile => {
        let i = parseInt(tile.parentNode.getAttribute('row-id'))
        let j = parseInt(tile.getAttribute('col-id'))
        board[i][j] = tile.textContent
    })
    htmlScore = document.querySelector('#score')

    // console.log("Before Save: ")
    // console.log(`Score: ${parseInt(htmlScore.firstElementChild.textContent)}`)
    // console.log(`Board: ${board}`)
    // console.log(`Status: ${game_over}`)


    fetch(`https://gameboyzarcade.herokuapp.com/games/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ board_state: board, score: parseInt(htmlScore.firstElementChild.textContent), game_over })
    })
        .then(r => r.json())
        .then(game => {
            // console.log("After Save: ")
            // console.log(`Score: ${game.score}`)
            // console.log(`Board: ${game.board_state}`)
            // console.log(`Status: ${game.game_over}`)
        })
    //don't need to do anything with saved board because we already updated the dom optimistically
}

function checkGameOverTTT() {
    if (tictactoe()) {
        //win or lose
        return true
    } else if (blanks.length === 0) {
        //stale mate, it's a draw. Do something.
        sleep(500).then(() => {
            alert("Stale Mate :/")
            handleGameOverTTT()
        })
        return true
    }
    return false
}

function tictactoe() {
    if (threeInARowTTT("ex")) {
        // you win!
        sleep(500).then(() => {
            alert("You Won! :D")
            incrementScoreTTT(50)
            handleGameOverTTT()
        })
        return true
    }
    else if (threeInARowTTT("oh")) {
        // you lose!
        sleep(500).then(() => {
            alert("You Lost! :(")
            incrementScoreTTT(-50)
            handleGameOverTTT()
        })
        return true
    }
    // else nothing; game continues
    return false
}

function threeInARowTTT(symb) {
    let symbs = Array.from(tiles).filter(tile => tile.classList.contains(symb))
    for (let count = 0; count < symbs.length; count++) {
        tile = symbs[count]

        let i = parseInt(tile.parentNode.getAttribute('row-id'))
        let j = parseInt(tile.getAttribute('col-id'))
        if ((i == 0 || i == 2) && j == 1) {
            //check left and right
            let leftNeighbor = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j - 1}"]`)
            let rightNeighbor = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j + 1}"]`)
            if (leftNeighbor.classList.contains(symb) && rightNeighbor.classList.contains(symb)) {
                return true
            }
        } else if ((j == 0 || j == 2) && i == 1) {
            //check up and down
            let upNeighbor = document.querySelector(`[row-id="${i - 1}"]`).querySelector(`[col-id="${j}"]`)
            let downNeighbor = document.querySelector(`[row-id="${i + 1}"]`).querySelector(`[col-id="${j}"]`)
            if (upNeighbor.classList.contains(symb) && downNeighbor.classList.contains(symb)) {
                return true
            }
        } else if (i == 1 && j == 1) {
            //left and right
            let leftNeighbor = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j - 1}"]`)
            let rightNeighbor = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j + 1}"]`)
            if (leftNeighbor.classList.contains(symb) && rightNeighbor.classList.contains(symb)) {
                return true
            }
            //up and down
            let upNeighbor = document.querySelector(`[row-id="${i - 1}"]`).querySelector(`[col-id="${j}"]`)
            let downNeighbor = document.querySelector(`[row-id="${i + 1}"]`).querySelector(`[col-id="${j}"]`)
            if (upNeighbor.classList.contains(symb) && downNeighbor.classList.contains(symb)) {
                return true
            }
            //major diagonal
            let upLeftNeighbor = document.querySelector(`[row-id="${i - 1}"]`).querySelector(`[col-id="${j - 1}"]`)
            let downRightNeighbor = document.querySelector(`[row-id="${i + 1}"]`).querySelector(`[col-id="${j + 1}"]`)
            if (upLeftNeighbor.classList.contains(symb) && downRightNeighbor.classList.contains(symb)) {
                return true
            }
            //minor diagonal
            let downLeftNeighbor = document.querySelector(`[row-id="${i + 1}"]`).querySelector(`[col-id="${j - 1}"]`)
            let upRightNeighbor = document.querySelector(`[row-id="${i - 1}"]`).querySelector(`[col-id="${j + 1}"]`)
            if (downLeftNeighbor.classList.contains(symb) && upRightNeighbor.classList.contains(symb)) {
                return true
            }
        }
    }
    return false
}
