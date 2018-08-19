/**
 * @typedef GameState
 * @property {Number} currentPlayer
 * @property {Array<number>} field
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {GameState} gameState
 */
export function draw(canvas, ctx, gameState) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 10;
    const cellSize = canvas.width / 3;

    gameState.field.forEach((_, index) => {
        const top = Math.floor(index / 3) * cellSize;
        const left = index % 3 * cellSize;

        ctx.strokeRect(top, left, cellSize, cellSize);
    });
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawX(ctx, top, left, size) {
    ctx.beginPath();

    ctx.moveTo(left, top);
    ctx.lineTo(left + size, top + size);

    ctx.moveTo(left + size, top);
    ctx.lineTo(left, top + size);

    ctx.closePath();
    ctx.stroke();

}
