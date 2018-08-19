export function setupCanvas() {
    const canvas = document.querySelector('canvas');

    const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    return { canvas, ctx };
}
