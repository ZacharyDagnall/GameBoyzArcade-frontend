
const boardDiv = document.querySelector('#board')
function makeBoard() {  //create HTML items on document
    for (let i = 0; i < 4; i++) {
        const row = document.createElement('div')
        row.classList.add("row")
        row.setAttribute("row-id", i)
        boardDiv.append(row)
        for (let j = 0; j < 4; j++) {
            let tile = document.createElement('div')
            tile.setAttribute("col-id", j)
            tile.classList.add("tile")
            row.append(tile)
        }
    }
}
function loadBoard(board) {  //render board (new or updated)
    board.forEach((row, i) => {
        let htmlRow = document.querySelector(`[row-id="${i}"]`)
        row.forEach((col, j) => {
            let htmlCol = htmlRow.querySelector(`[col-id="${j}"]`)
            htmlCol.textContent = col
            if (col === 0) {
                htmlCol.classList.add("blank")
            }
        })
    })
    blankZeroes()
}

const htmlScore = document.querySelector('#actual-score')
function loadScore(score) {
    htmlScore.textContent = score
}

function fetchBoard() {
    fetch(`http://localhost:3000/games/2`)
        .then(r => r.json())
        .then(game => {
            loadBoard(game.board_state)
            loadScore(game.score)
        })
}

document.addEventListener("keydown", event => {
    tiles.forEach(tile => {
        tile.classList.remove("smushed")
    })
    if (event.key === "ArrowUp") {
        event.preventDefault()
        swipeUp()
    } else if (event.key === "ArrowDown") {
        event.preventDefault()
        swipeDown()
    } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        swipeLeft()
    } else if (event.key === "ArrowRight") {
        event.preventDefault()
        swipeRight()
    }
})

function swipeUp() {
    console.log("swiped up!")
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            moveUp(i, j)
        }
    }
    save()
}
function swipeDown() {
    console.log("swiped down!")
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i >= 0; i--) {
            moveDown(i, j)
        }
    }
    save()
}
function swipeLeft() {
    console.log("swiped left!")
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            moveLeft(i, j)
        }
    }
    save()
}
function swipeRight() {
    console.log("swiped right!")
    for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
            moveRight(i, j)
        }
    }
    save()
}

function moveRight(i, j) {
    if (j !== 3) {
        let htmlTile = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j}"]`)
        let nextTile = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j + 1}"]`)

        if (nextTile.textContent === "0") {
            nextTile.textContent = htmlTile.textContent
            nextTile.classList.remove("blank")
            htmlTile.textContent = 0
            moveRight(i, j + 1)
        } else if (htmlTile.textContent === nextTile.textContent && !htmlTile.classList.contains("smushed") && !nextTile.classList.contains("smushed")) {
            let score = 2 * parseInt(htmlTile.textContent)
            nextTile.textContent = score
            nextTile.classList.add("smushed")
            loadScore(parseInt(htmlScore.textContent) + score)
            htmlTile.textContent = 0
            moveRight(i, j + 1)
        }
    }
    blankZeroes()
}

function moveLeft(i, j) {
    if (j !== 0) {
        let htmlTile = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j}"]`)
        let nextTile = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j - 1}"]`)

        if (nextTile.textContent === "0") {
            nextTile.textContent = htmlTile.textContent
            nextTile.classList.remove("blank")
            htmlTile.textContent = 0
            moveLeft(i, j - 1)
        } else if (htmlTile.textContent === nextTile.textContent && !htmlTile.classList.contains("smushed") && !nextTile.classList.contains("smushed")) {
            let score = 2 * parseInt(htmlTile.textContent)
            nextTile.textContent = score
            nextTile.classList.add("smushed")
            loadScore(parseInt(htmlScore.textContent) + score)
            htmlTile.textContent = 0
            moveLeft(i, j - 1)
        }
    }
    blankZeroes()
}

function moveDown(i, j) {
    if (i !== 3) {
        let htmlTile = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j}"]`)
        let nextTile = document.querySelector(`[row-id="${i + 1}"]`).querySelector(`[col-id="${j}"]`)

        if (nextTile.textContent === "0") {
            nextTile.textContent = htmlTile.textContent
            nextTile.classList.remove("blank")
            htmlTile.textContent = 0
            moveDown(i + 1, j)
        } else if (htmlTile.textContent === nextTile.textContent && !htmlTile.classList.contains("smushed") && !nextTile.classList.contains("smushed")) {
            let score = 2 * parseInt(htmlTile.textContent)
            nextTile.textContent = score
            nextTile.classList.add("smushed")
            loadScore(parseInt(htmlScore.textContent) + score)
            htmlTile.textContent = 0
            moveDown(i + 1, j)
        }
    }
    blankZeroes()
}

function moveUp(i, j) {
    if (i !== 0) {
        let htmlTile = document.querySelector(`[row-id="${i}"]`).querySelector(`[col-id="${j}"]`)
        let nextTile = document.querySelector(`[row-id="${i - 1}"]`).querySelector(`[col-id="${j}"]`)

        if (nextTile.textContent === "0") {
            nextTile.textContent = htmlTile.textContent
            nextTile.classList.remove("blank")
            htmlTile.textContent = 0
            moveUp(i - 1, j)
        } else if (htmlTile.textContent === nextTile.textContent && !htmlTile.classList.contains("smushed") && !nextTile.classList.contains("smushed")) {
            let score = 2 * parseInt(htmlTile.textContent)
            nextTile.textContent = score
            nextTile.classList.add("smushed")
            loadScore(parseInt(htmlScore.textContent) + score)
            htmlTile.textContent = 0
            moveUp(i - 1, j)
        }
    }
    blankZeroes()
}

// function fetchScore(newPoints) {
//     fetch(`http://localhost:3000/games/2`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify({ score: parseInt(htmlScore.textContent) + newPoints })
//     })
//         .then(r => r.json())
//         .then(game => {
//             loadScore(game.score)
//         })
// }

function blankZeroes() {
    tiles.forEach(tile => {
        if (tile.textContent === "0") {
            tile.classList.add("blank")
        }
    })
}

function save() {
    let board = [[], [], [], []]
    tiles.forEach(tile => {
        let i = tile.parentNode.getAttribute('row-id')
        let j = tile.getAttribute('col-id')
        board[i][j] = tile.textContent
    })
    console.log(board)
    fetch(`http://localhost:3000/games/2`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ board_state: board, score: parseInt(htmlScore.textContent) })
    })
        .then(r => r.json())
        .then(console.log)
    //don't need to do anything with saved board because we already updated the dom optimistically
}


makeBoard()
fetchBoard() // blank or most recent
const tiles = document.querySelectorAll('.tile')