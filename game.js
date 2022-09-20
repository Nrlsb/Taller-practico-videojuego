const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y:undefined
}
const giftPosition = {
    x: undefined,
    y:undefined
}
let enemyPositions = [];


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

//console.log('ancho', window.innerWidth);
//console.log('alto', window.innerHeight);



function startGame() {
    //console.log({canvasSize, elementSize});

    game.font = (elementSize - 10) + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100)
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    enemyPositions = [];

    game.clearRect(0, 0, canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
        const emoji = emojis[col];
        const posX = elementSize * (colI + 1);
        const posY = elementSize * (rowI + 1);

        if (col == 'O') {
            if (!playerPosition.x && !playerPosition.y) {
                playerPosition.x = posX;
                playerPosition.y = posY;
            }
        } else if (col == 'I') {
            giftPosition.x = posX;
            giftPosition.y = posY;
        } else if (col == 'X') {
            enemyPositions.push({
                x: posX,
                y: posY
            })
        }


        game.fillText(emoji, posX, posY)
        });
    });

    movePlayer();
}

function movePlayer () {
    const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
    const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin();
    } 
    
    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}


function levelFail () {
    console.log('Chocaste contra un enemigo :(');
    console.log(lives);
    lives--;


    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Terminaste el juego!!!');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record :D';
        } else {
            pResult.innerHTML = 'Lo siento no superaste el record :(';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';
    }
    console.log({recordTime, playerTime});
}

function showLives () {
    const heartsArray = Array(lives).fill(emojis['HEART']);
    //console.log(heartsArray);

    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart))
}


function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function setCanvasSize() {
    if (window.innerHeight > innerWidth) {
        canvasSize = innerWidth * 0.8;
    } else {
        canvasSize = innerHeight * 0.8;
    }

    canvasSize = Number(canvasSize.toFixed(3));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = (canvasSize / 10);

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}




window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);


function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    if (event.key == 'ArrowLeft') moveLeft();
    if (event.key == 'ArrowRight') moveRight();
    if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
    if ((playerPosition.y - elementSize) > elementSize) {
        playerPosition.y -= elementSize;
        startGame();
    }
}
function moveLeft() {
    if ((playerPosition.x - elementSize) > elementSize) {
        playerPosition.x -= elementSize;
        startGame();
    }
}
function moveRight() {
    if ((playerPosition.x + elementSize) < canvasSize) {
        playerPosition.x += elementSize;
        startGame();
    }
}
function moveDown() {
    if ((playerPosition.y + elementSize) < canvasSize) {
        playerPosition.y += elementSize;
        startGame();
    }
}