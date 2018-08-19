export function setupCanvas() {
    const canvas = document.querySelector('canvas');

    const size = Math.min(document.body.offsetHeight, document.body.offsetWidth) * 0.8;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    return { canvas, ctx };
}
