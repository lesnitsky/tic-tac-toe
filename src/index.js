const GameState = {
    currentPlayer: 0,
    field: Array.from({ length: 9 }).fill(-1),
}

function changeCurrentPlayer(gameState) {
    gameState.currentPlayer = 1 ^ gameState.currentPlayer;
}

function getArrayIndexFromRowAndCol(rowIndex, colIndex) {
    return rowIndex * 3 + colIndex;
}
