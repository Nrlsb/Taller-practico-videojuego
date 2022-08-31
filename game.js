const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let canvasSize;
let elementSize;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

console.log('ancho', window.innerWidth);
console.log('alto', window.innerHeight);

function startGame() {
    console.log({canvasSize, elementSize});

    game.font = (elementSize - 10) + 'px Verdana';
    game.textAlign = 'end';

    for (let i = 1; i <= 10; i++) {
        game.fillText(emojis['X'], elementSize * i, elementSize);
    }
}

function setCanvasSize() {
    if (window.innerHeight > innerWidth) {
        canvasSize = innerWidth * 0.8;
    } else {
        canvasSize = innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize = (canvasSize / 10) - 2;

    startGame();
}