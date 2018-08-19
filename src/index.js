import { GameState, getWinner, turn } from './game-state.js';

function* gameLoop(gameState) {
    let winner = -1;

    while (winner < 0) {
        const [rowIndex, colIndex] = yield;
        turn(gameState, rowIndex, colIndex);

        winner = getWinner(gameState);
    }
}

const game = gameLoop(GameState);
game.next();

const canvas = document.querySelector('canvas');

const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
canvas.width = size;
canvas.height = size;
