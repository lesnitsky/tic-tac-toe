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

}
