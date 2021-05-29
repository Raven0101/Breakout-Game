const gameCanvas = document.getElementById('gameArea')
const ctx = gameCanvas.getContext('2d')

const backgroundColor = '#faf3f3'
const brickColor = '#a7bbc7'
const ballColor = '#da7f8f'

const brickInfo = {
    h: 20,
    w: 70,
    offsetX: 45,
    offsetY: 60,
    padding: 10,
    visible: true
}
const brickRow = 5
const brickColumn = 9

const board = {
    h: 10,
    w: 80,
    speed: 8,
    dx: 0,
    x: gameCanvas.width / 2 - 40,
    y: gameCanvas.height - 20,
    visible: true
}

const ball = {
    r: 10,
    speed: -4,
    x: gameCanvas.width / 2,
    y: gameCanvas.height / 2,
    dx: -4,
    dy: -4,
    visible: true
}

function start() {
    ctx.fillStyle = '#da7f8f'
    ctx.fillRect(320, 280, 160, 40)
    ctx.fillStyle = '#faf3f3'
    ctx.textAlign = 'center'
    ctx.font = '30px Lato sans-serif'
    ctx.fillText('START', 400, 312)

}

start()

function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI)
    ctx.fillStyle = '#da7f8f'
    ctx.fill()
}

const bricks = []

function createBricks() {
    for (let i = 0; i < brickColumn; i++) {
        bricks[i] = []
        for (let j = 0; j < brickRow; j++) {
            const x = brickInfo.offsetX + i * (brickInfo.w + brickInfo.padding)
            const y = brickInfo.offsetY + j * (brickInfo.h + brickInfo.padding)
            bricks[i][j] = { x, y, ...brickInfo }
        }
    }
}

function drawBricks() {
    ctx.fillStyle = '#a7bbc7'
    bricks.forEach(column => column.forEach(brick => {
        if (brick.visible) {
            ctx.fillRect(brick.x, brick.y, brick.w, brick.h)
        }
    }))
}

function drawBoard() {
    ctx.fillStyle = '#a7bbc7'
    ctx.fillRect(board.x, board.y, board.w, board.h)
}
var score = 0

function showScore() {
    ctx.fillStyle = brickColor
    ctx.textAlign = 'right'
    ctx.font = '20px Lato sans-serif'
    ctx.fillText(`SCORE: ${score}`, 755, 40)
}

function moveBoard() {
    board.x += board.dx
    if (board.x <= 0) {
        board.x = 0
    }
    if ((board.x + board.w) >= gameCanvas.width) {
        board.x = gameCanvas.width - board.w
    }
}

function moveBall() {
    ball.x += ball.dx
    ball.y += ball.dy
        //wall collision detect
    if (ball.x <= ball.r || ball.x + ball.r >= gameCanvas.width) {
        ball.dx *= -1
    }
    if (ball.y <= ball.r) {
        ball.dy *= -1
    }
    if ((ball.x - ball.r) >= board.x && (ball.x + ball.r) <= (board.x + board.w) && (ball.y + ball.r) >= board.y) {
        ball.dy *= -1
    }
    if ((ball.y + ball.r) >= gameCanvas.height && !((ball.x - ball.r) >= board.x && (ball.x + ball.r) <= (board.x + board.w))) {
        gameOver()

    }

    // bricks collision test
    bricks.forEach(column => column.forEach(brick => {
        if (brick.visible) {
            if ((((ball.x + ball.r) >= brick.x) && ball.x < brick.x && (ball.y >= brick.y && ball.y <= (brick.y + brick.h))) ||
                (((ball.x - ball.r) <= (brick.x + brick.w)) && ball.x >= (brick.x + brick.w) && (ball.y >= brick.y && ball.y <= (brick.y + brick.h)))) {
                brick.visible = false
                ball.dx *= -1
                score += 10
            } else if ((((ball.y + ball.r) >= brick.y) && ball.y <= brick.y && ((ball.x >= brick.x) && (ball.x <= (brick.x + brick.w)))) ||
                (((ball.y - ball.r) <= (brick.y + brick.h)) && ball.y >= (brick.y + brick.h) && ((ball.x >= brick.x) && (ball.x <= (brick.x + brick.w))))) {
                brick.visible = false
                ball.dy *= -1
                score += 10
            }
        }
    }))
}

var stop = false

function gameOver() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    ctx.fillStyle = ballColor
    ctx.textAlign = 'center'
    ctx.font = '50px Lato sans-serif'
    ctx.fillText('GAME OVER', 400, 310)
    ctx.fillRect(350, 320, 100, 30)
    ctx.fillStyle = backgroundColor
    ctx.textAlign = 'center'
    ctx.font = '20px Lato sans-serif'
    ctx.fillText('RESTART', 400, 342)
    stop = true
}

function updateCanvas() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    drawBricks()
    moveBoard()
    moveBall()
    drawBoard()
    drawBall()
    showScore()
    if (!stop) {
        requestAnimationFrame(updateCanvas)
    }


}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        board.dx = board.speed
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        board.dx = -1 * board.speed
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'Left' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        board.dx = 0
    }
}

function canvasClick(e) {
    var clickX = e.pageX - gameCanvas.offsetLeft
    var clickY = e.pageY - gameCanvas.offsetTop
    console.log(clickX, clickY)
    if (!stop) {
        if (clickX > 320 && clickX < 480 && clickY > 280 && clickY < 320) {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
            createBricks()
            stop = false
            updateCanvas()
        }
    } else {
        if (clickX > 350 && clickX < 450 && clickY > 320 && clickY < 350) {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
            createBricks()
            ball.x = gameCanvas.width / 2
            ball.y = gameCanvas.width / 2
            ball.dx = ball.speed
            ball.dy = ball.speed
            board.x = gameCanvas.width / 2 - board.w / 2
            score = 0
            stop = false
            updateCanvas()
        }
    }

}

gameCanvas.onmousedown = canvasClick
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)