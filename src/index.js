const GameState = {
    currentPlayer: 0,
    field: Array.from({ length: 9 }).fill(-3),
}

const Rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
];

const Cols = [
    [0, 3, 6],
    [1, 4, 7],
    [6, 7, 8],
];

const Diagonals = [
    [0, 4, 8],
    [2, 4, 6],
];

function changeCurrentPlayer(gameState) {
    gameState.currentPlayer = 1 ^ gameState.currentPlayer;
}

function getArrayIndexFromRowAndCol(rowIndex, colIndex) {
    return rowIndex * 3 + colIndex;
}

function turn(gameState, rowIndex, colIndex) {
    const index = getArrayIndexFromRowAndCol(rowIndex, colIndex);
    const fieldValue = GameState.field[index];

    if (fieldValue >= 0) {
        return;
    }

    gameState.field[index] = gameState.currentPlayer;
    changeCurrentPlayer(gameState);
}

function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}

function getValues(gameState, indices) {
    return indices.map(index => gameState.field[index]);
}

function getWinner(gameState) {
    const rows = Rows.map((row) => getValues(gameState, row));
    const cols = Cols.map((col) => getValues(gameState, col));
    const diagonals = Diagonals.map((col) => getValues(gameState, col));

    const values = [...rows, ...cols, ...diagonals];

    let winner = -1;

    values.forEach((chunk) => {
        const chunkSum = sum(chunk);

        if (chunkSum === 0) {
            winner = 0;
            return;
        }

        if (chunkSum === 3) {
            winner = 1;
            return;
        }
    });

    return winner;
}

function* gameLoop(gameState) {
    let winner = -1;

    while (winner < 0) {
        const [rowIndex, colIndex] = yield;
        turn(gameState, rowIndex, colIndex);

        winner = getWinner(gameState);
    }
}

const turns = [
    [1, 1],
    [0, 1],
    [0, 0],
    [1, 2],
    [2, 2],
];
