# Tic Tac Toe

This tutorial will walk you through a process of creation of a tic-tac-toe game

> Built with [Git Tutor](https://github.com/R1ZZU/git-tutor)

## Project setup

Before we actually start writing code, I recommend to install [editorconfig](https://editorconfig.org/) plugin for your ide/text editor. It will keep code consistent in terms of line-endings style, indentation, newlines

📄 .editorconfig
```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true

```
Every web-app needs an html entry-point, this ain't exception, so let's add simple html file

📄 index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tic Tac Toe</title>
</head>
<body>

</body>
</html>

```
`index.js` will be a js main file

📄 src/index.js
```js
console.log('Hello world');

```
Now we need to add `script` to `index.html`

📄 index.html
```diff
      <title>Tic Tac Toe</title>
  </head>
  <body>
-
+     <script src="./src/index.js"></script>
  </body>
  </html>

```
Most likely the codebase will grow, so eventually we'll need some module system. This tutorial is not about setting-up a javascript bundler like [webpack](https://webpack.js.org/), so let's just use es6 modules which are already supported by latest Chrome. To make chrome understand `import` statement, `type` attribute should be set to `module`

📄 index.html
```diff
      <title>Tic Tac Toe</title>
  </head>
  <body>
-     <script src="./src/index.js"></script>
+     <script src="./src/index.js" type="module"></script>
  </body>
  </html>

```
## Let's get started

### Game state

Let's define a game state variable

📄 src/index.js
```diff
- console.log('Hello world');
+ const GameState = {
+
+ }

```
We'll need an information about current player to know whether `x` or `o` should be placed on a game field.

📄 src/index.js
```diff
  const GameState = {
-
+     currentPlayer: 0,
  }

```
`0` – `x` should be placed

`1` – `o`


`field` property will represent a game state.
That's an array of 9 elements (3 columns x 3 rows) with initial value `-1`. Simple `if (fieldValue > 0)` check will work to distinguish empty fields from filled.

📄 src/index.js
```diff
  const GameState = {
      currentPlayer: 0,
+     field: Array.from({ length: 9 }).fill(-1),
  }

```
### Game state modifications

Now we need to implement a function which will switch a current player. Let's do this with `XOR` operator. ([how xor works](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_XOR)).

📄 src/index.js
```diff
      currentPlayer: 0,
      field: Array.from({ length: 9 }).fill(-1),
  }
+
+ function changeCurrentPlayer(gameState) {
+     gameState.currentPlayer = 1 ^ gameState.currentPlayer;
+ }

```
To modify field values in plain array we'll need a function to convert `row` and `col` indices to an array index

📄 src/index.js
```diff
  function changeCurrentPlayer(gameState) {
      gameState.currentPlayer = 1 ^ gameState.currentPlayer;
  }
+
+ function getArrayIndexFromRowAndCol(rowIndex, colIndex) {
+     return rowIndex * 3 + colIndex;
+ }

```
### Game turn logic

Now we'll start handling game turn logic.
Create a function placeholder

📄 src/index.js
```diff
  function getArrayIndexFromRowAndCol(rowIndex, colIndex) {
      return rowIndex * 3 + colIndex;
  }
+
+ function turn(gameState, rowIndex, colIndex) {
+
+ }

```
Convert row and col indices to plain array index

📄 src/index.js
```diff
  }

  function turn(gameState, rowIndex, colIndex) {
-
+     const index = getArrayIndexFromRowAndCol(rowIndex, colIndex);
  }

```
If game field already contains some value, do nothing

📄 src/index.js
```diff

  function turn(gameState, rowIndex, colIndex) {
      const index = getArrayIndexFromRowAndCol(rowIndex, colIndex);
+     const fieldValue = GameState.field[index];
+
+     if (fieldValue >= 0) {
+         return;
+     }
  }

```
Put player identifier to a field

📄 src/index.js
```diff
      if (fieldValue >= 0) {
          return;
      }
+
+     gameState.field[index] = gameState.currentPlayer;
  }

```
and change current player

📄 src/index.js
```diff
      }

      gameState.field[index] = gameState.currentPlayer;
+     changeCurrentPlayer(gameState);
  }

```
### Win

The next thing we need to handle is a "win" state.
Lets add helper variables which will contain array indices by rows:

📄 src/index.js
```diff
      field: Array.from({ length: 9 }).fill(-1),
  }

+ const Rows = [
+     [0, 1, 2],
+     [3, 4, 5],
+     [6, 7, 8],
+ ];
+
  function changeCurrentPlayer(gameState) {
      gameState.currentPlayer = 1 ^ gameState.currentPlayer;
  }

```
cols:

📄 src/index.js
```diff
      [6, 7, 8],
  ];

+ const Cols = [
+     [0, 3, 6],
+     [1, 4, 7],
+     [6, 7, 8],
+ ];
+
  function changeCurrentPlayer(gameState) {
      gameState.currentPlayer = 1 ^ gameState.currentPlayer;
  }

```
and diagonals

📄 src/index.js
```diff
      [6, 7, 8],
  ];

+ const Diagonals = [
+     [0, 4, 8],
+     [2, 4, 6],
+ ];
+
  function changeCurrentPlayer(gameState) {
      gameState.currentPlayer = 1 ^ gameState.currentPlayer;
  }

```
Now let's take a look at some examples of a "win" state

```
  1 -1  0
  0  1 -1
 -1 -1  1
```

Winner is `1`. Sum of diagonal values equals 3

We can assume that we can detect a winner by getting a sum of each row, col and diagonal values and comparing it to a 0 (0 + 0 + 0) or 3 (1 + 1 + 1)

But here's another example

```
  0 -1  1
  1  0 -1
 -1 -1  0
```

A sum of 1st and 2nd row = 0

Sum of both diagonals = 0

Sum of 1st and 3d cols = 0

That's not the right way to go... 😞

💡 Easy fix!
Change initial value of field to `-3` 😎

📄 src/index.js
```diff
  const GameState = {
      currentPlayer: 0,
-     field: Array.from({ length: 9 }).fill(-1),
+     field: Array.from({ length: 9 }).fill(-3),
  }

  const Rows = [

```
Ok, now we are good. So let's create a simple `sum` function

📄 src/index.js
```diff
      gameState.field[index] = gameState.currentPlayer;
      changeCurrentPlayer(gameState);
  }
+
+ function sum(arr) {
+     return arr.reduce((a, b) => a + b, 0);
+ }

```
and a helper function which maps field indices to values

📄 src/index.js
```diff
  function sum(arr) {
      return arr.reduce((a, b) => a + b, 0);
  }
+
+ function getValues(gameState, indices) {
+     return indices.map(index => gameState.field[index]);
+ }

```
function `getWinner` should find if some row, col or diagonal sum is 0 or 3. Let's get values of all rows

📄 src/index.js
```diff
  function getValues(gameState, indices) {
      return indices.map(index => gameState.field[index]);
  }
+
+ function getWinner(gameState) {
+     const rows = Rows.map((row) => getValues(gameState, row));
+ }

```
and do the same for cols and diagonals

📄 src/index.js
```diff

  function getWinner(gameState) {
      const rows = Rows.map((row) => getValues(gameState, row));
+     const cols = Cols.map((col) => getValues(gameState, col));
+     const diagonals = Diagonals.map((col) => getValues(gameState, col));
  }

```
now let's create a single array of all values in field

📄 src/index.js
```diff
      const rows = Rows.map((row) => getValues(gameState, row));
      const cols = Cols.map((col) => getValues(gameState, col));
      const diagonals = Diagonals.map((col) => getValues(gameState, col));
+
+     const values = [...rows, ...cols, ...diagonals];
  }

```
and find if some chunk sum equals 0 or 3

📄 src/index.js
```diff
      const diagonals = Diagonals.map((col) => getValues(gameState, col));

      const values = [...rows, ...cols, ...diagonals];
+
+     let winner = -1;
+
+     values.forEach((chunk) => {
+         const chunkSum = sum(chunk);
+
+         if (chunkSum === 0) {
+             winner = 0;
+             return;
+         }
+
+         if (chunkSum === 3) {
+             winner = 1;
+             return;
+         }
+     });
+
+     return winner;
  }

```
### Game loop

Now let's describe a game loop.
We'll create a generator function to query `row` and `col` for each next turn from outside world.
If you are not familliar with generator functions – read [this](https://codeburst.io/what-are-javascript-generators-and-how-to-use-them-c6f2713fd12e) medium post

📄 src/index.js
```diff

      return winner;
  }
+
+ function* gameLoop(gameState) {
+
+ }

```
Generator should execute until `getWinner` returns anything but `-1`.

📄 src/index.js
```diff
  }

  function* gameLoop(gameState) {
+     let winner = -1;
+
+     while (winner < 0) {

+         winner = getWinner(gameState);
+     }
  }

```
it should also make a turn befor each `getWinner` call

📄 src/index.js
```diff
      let winner = -1;

      while (winner < 0) {
+         const [rowIndex, colIndex] = yield;
+         turn(gameState, rowIndex, colIndex);

          winner = getWinner(gameState);
      }

```
Now let's test our `gameLoop`

Create a mock scenario of a game:

📄 src/index.js
```diff
          winner = getWinner(gameState);
      }
  }
+
+ const turns = [
+     [1, 1],
+     [0, 1],
+     [0, 0],
+     [1, 2],
+     [2, 2],
+ ];

```
Create a game generator object

📄 src/index.js
```diff
      [1, 2],
      [2, 2],
  ];
+
+ const game = gameLoop(GameState);
+ game.next();

```
Iterate over game turns and pass each turn to generator

📄 src/index.js
```diff

  const game = gameLoop(GameState);
  game.next();
+
+ turns.forEach(turn => game.next(turn));

```
After execution of this scenario game generator should finish it execution.
This means that leading `.next()` call should return an object `{ value: undefined, done: true }`

📄 src/index.js
```diff
  game.next();

  turns.forEach(turn => game.next(turn));
+
+ console.log(game.next());

```
Let's check it with node.js

```sh
node src/index.js
{ value: undefined, done: true }
```

Yay, it works!


### Refactor time

Now as a core of a game is ready let's start refactor our `index.js` and split it in several modules

Drop testing code

📄 src/index.js
```diff
      }
  }

- const turns = [
-     [1, 1],
-     [0, 1],
-     [0, 0],
-     [1, 2],
-     [2, 2],
- ];
-
  const game = gameLoop(GameState);
  game.next();
-
- turns.forEach(turn => game.next(turn));
-
- console.log(game.next());

```
Move everything but `gameLoop` from `index.js` to `game-state.js`.

📄 src/game-state.js
```js
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
    const fieldValue = gameState.field[index];

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

```
📄 src/index.js
```diff
- const GameState = {
-     currentPlayer: 0,
-     field: Array.from({ length: 9 }).fill(-3),
- }
-
- const Rows = [
-     [0, 1, 2],
-     [3, 4, 5],
-     [6, 7, 8],
- ];
-
- const Cols = [
-     [0, 3, 6],
-     [1, 4, 7],
-     [6, 7, 8],
- ];
-
- const Diagonals = [
-     [0, 4, 8],
-     [2, 4, 6],
- ];
-
- function changeCurrentPlayer(gameState) {
-     gameState.currentPlayer = 1 ^ gameState.currentPlayer;
- }
-
- function getArrayIndexFromRowAndCol(rowIndex, colIndex) {
-     return rowIndex * 3 + colIndex;
- }
-
- function turn(gameState, rowIndex, colIndex) {
-     const index = getArrayIndexFromRowAndCol(rowIndex, colIndex);
-     const fieldValue = GameState.field[index];
-
-     if (fieldValue >= 0) {
-         return;
-     }
-
-     gameState.field[index] = gameState.currentPlayer;
-     changeCurrentPlayer(gameState);
- }
-
- function sum(arr) {
-     return arr.reduce((a, b) => a + b, 0);
- }
-
- function getValues(gameState, indices) {
-     return indices.map(index => gameState.field[index]);
- }
-
- function getWinner(gameState) {
-     const rows = Rows.map((row) => getValues(gameState, row));
-     const cols = Cols.map((col) => getValues(gameState, col));
-     const diagonals = Diagonals.map((col) => getValues(gameState, col));
-
-     const values = [...rows, ...cols, ...diagonals];
-
-     let winner = -1;
-
-     values.forEach((chunk) => {
-         const chunkSum = sum(chunk);
-
-         if (chunkSum === 0) {
-             winner = 0;
-             return;
-         }
-
-         if (chunkSum === 3) {
-             winner = 1;
-             return;
-         }
-     });
-
-     return winner;
- }
-
  function* gameLoop(gameState) {
      let winner = -1;


```
Export everything `gameLoop` depends on

📄 src/game-state.js
```diff
- const GameState = {
+ export const GameState = {
      currentPlayer: 0,
      field: Array.from({ length: 9 }).fill(-3),
  }
      return rowIndex * 3 + colIndex;
  }

- function turn(gameState, rowIndex, colIndex) {
+ export function turn(gameState, rowIndex, colIndex) {
      const index = getArrayIndexFromRowAndCol(rowIndex, colIndex);
      const fieldValue = gameState.field[index];

      return indices.map(index => gameState.field[index]);
  }

- function getWinner(gameState) {
+ export function getWinner(gameState) {
      const rows = Rows.map((row) => getValues(gameState, row));
      const cols = Cols.map((col) => getValues(gameState, col));
      const diagonals = Diagonals.map((col) => getValues(gameState, col));

```
and import it in `index.js`

📄 src/index.js
```diff
+ import { GameState, getWinner, turn } from './game-state.js';
+
  function* gameLoop(gameState) {
      let winner = -1;


```
### Rendering game state on canvas

Add canvas to `index.html`

📄 index.html
```diff
  </head>
  <body>
      <script src="./src/index.js" type="module"></script>
+     <canvas></canvas>
  </body>
  </html>

```
and get a reference to canvas with `querySelector`

📄 src/index.js
```diff

  const game = gameLoop(GameState);
  game.next();
+
+ const canvas = document.querySelector('canvas');

```
Let's make body full-height

📄 index.html
```diff
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tic Tac Toe</title>
+     <style>
+     html, body {
+         height: 100%;
+     }
+     </style>
  </head>
  <body>
      <script src="./src/index.js" type="module"></script>

```
and reset default margins

📄 index.html
```diff
      html, body {
          height: 100%;
      }
+
+     body {
+         margin: 0;
+     }
      </style>
  </head>
  <body>

```
Setup canvas size

📄 src/index.js
```diff
  game.next();

  const canvas = document.querySelector('canvas');
+
+ const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
+ canvas.width = size;
+ canvas.height = size;

```
and get a 2d context

📄 src/index.js
```diff
  const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
  canvas.width = size;
  canvas.height = size;
+
+ const ctx = canvas.getContext('2d');

```
Move canvas setup code to separate file

📄 src/canvas-setup.js
```js
export function setupCanvas() {
    const canvas = document.querySelector('canvas');

    const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    return { canvas, ctx };
}

```
📄 src/index.js
```diff

  const game = gameLoop(GameState);
  game.next();
-
- const canvas = document.querySelector('canvas');
-
- const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
- canvas.width = size;
- canvas.height = size;
-
- const ctx = canvas.getContext('2d');

```
and import it to `index.js`

📄 src/index.js
```diff
  import { GameState, getWinner, turn } from './game-state.js';
+ import { setupCanvas } from './canvas-setup.js';

  function* gameLoop(gameState) {
      let winner = -1;

  const game = gameLoop(GameState);
  game.next();
+
+ const { canvas, ctx } = setupCanvas();

```
Now let's create `render` function which will visualize the game state

📄 src/renderer.js
```js
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

}

```
We'll need to clear the whole canvas on each `render` call

📄 src/renderer.js
```diff
   * @param {GameState} gameState
   */
  export function draw(canvas, ctx, gameState) {
-
+     ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

```
We'll render each cell with `strokeRect`, so let's setup `cellSize` (width and height of each game field cell) and `lineWidth` (border width of each cell)

📄 src/renderer.js
```diff
   */
  export function draw(canvas, ctx, gameState) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
+
+     ctx.lineWidth = 10;
+     const cellSize = canvas.width / 3;
+
  }

```
And finally we rendered smth! 🎉

📄 src/renderer.js
```diff
      ctx.lineWidth = 10;
      const cellSize = canvas.width / 3;

+     gameState.field.forEach((_, index) => {
+         const top = Math.floor(index / 3) * cellSize;
+         const left = index % 3 * cellSize;
+
+         ctx.strokeRect(top, left, cellSize, cellSize);
+     });
  }

```
To see the result install `live-server`

```sh
npm i -g live-server
live-server .
```


Wait, what? Nothing rendered 😢
That's because we forgot to import and call `draw` function

📄 src/index.js
```diff
  import { GameState, getWinner, turn } from './game-state.js';
  import { setupCanvas } from './canvas-setup.js';
+ import { draw } from './renderer.js';

  function* gameLoop(gameState) {
      let winner = -1;
  game.next();

  const { canvas, ctx } = setupCanvas();
+ draw(canvas, ctx, GameState);

```
Let's make canvas a bit smaller to leave some space for other UI

📄 src/canvas-setup.js
```diff
  export function setupCanvas() {
      const canvas = document.querySelector('canvas');

-     const size = Math.min(document.body.offsetHeight, document.body.offsetWidth);
+     const size = Math.min(document.body.offsetHeight, document.body.offsetWidth) * 0.8;
      canvas.width = size;
      canvas.height = size;


```
and add a css border to make all cell edges look the same

📄 index.html
```diff
      body {
          margin: 0;
      }
+
+     canvas {
+         border: 5px solid black;
+     }
      </style>
  </head>
  <body>

```
It also looks weird in top-left corner, so align canvas to center with flex-box

📄 index.html
```diff
      <style>
      html, body {
          height: 100%;
+         display: flex;
+         align-items: center;
+         justify-content: center;
      }

      body {

```
So, we've rendered game field cells.
Now let's render `X` and `O` symbols

📄 src/renderer.js
```diff
          ctx.strokeRect(top, left, cellSize, cellSize);
      });
  }
+
+ /**
+  * @param {CanvasRenderingContext2D} ctx
+  */
+ function drawX(ctx, top, left, size) {
+
+ }

```
We'll use `path` to render symbol both for `X` and `O`

📄 src/renderer.js
```diff
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawX(ctx, top, left, size) {
+     ctx.beginPath();
+
+     ctx.closePath();
+     ctx.stroke();

  }

```
Draw a line from top-left to bottom-right

📄 src/renderer.js
```diff
  function drawX(ctx, top, left, size) {
      ctx.beginPath();

+     ctx.moveTo(left, top);
+     ctx.lineTo(left + size, top + size);
+
      ctx.closePath();
      ctx.stroke();


```
Draw a line from top-right to bottom-left

📄 src/renderer.js
```diff
      ctx.moveTo(left, top);
      ctx.lineTo(left + size, top + size);

+     ctx.moveTo(left + size, top);
+     ctx.lineTo(left, top + size);
+
      ctx.closePath();
      ctx.stroke();


```
Rendering `O` is even more simple

📄 src/renderer.js
```diff

      ctx.closePath();
      ctx.stroke();
+ }

+ /**
+  * @param {CanvasRenderingContext2D} ctx
+  */
+ function drawO(ctx, centerX, centerY, radius) {
+     ctx.beginPath();
+
+     ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
+     ctx.closePath();
+
+     ctx.stroke();
  }

```
And let's actually render X or O depending on a field value

📄 src/renderer.js
```diff
      ctx.lineWidth = 10;
      const cellSize = canvas.width / 3;

-     gameState.field.forEach((_, index) => {
+     gameState.field.forEach((value, index) => {
          const top = Math.floor(index / 3) * cellSize;
          const left = index % 3 * cellSize;

          ctx.strokeRect(top, left, cellSize, cellSize);
+
+         if (value < 0) {
+             return;
+         }
+
+         if (value === 0) {
+             drawX(ctx, top, left, cellSize);
+         } else {
+             drawO(ctx, left + cellSize / 2, top + cellSize / 2, cellSize / 2);
+         }
      });
  }


```
Nothing rendered? That's correct, every field value is -2, so let's make some turns

📄 src/index.js
```diff
  game.next();

  const { canvas, ctx } = setupCanvas();
+
+ turn(GameState, 0, 1);
+ turn(GameState, 1, 1);
+ turn(GameState, 2, 0);
+
  draw(canvas, ctx, GameState);

```
📄 src/renderer.js
```diff
          }

          if (value === 0) {
-             drawX(ctx, top, left, cellSize);
+             const margin = cellSize * 0.2;
+             const size = cellSize * 0.6;
+
+             drawX(ctx, top + margin, left + margin, size);
          } else {
-             drawO(ctx, left + cellSize / 2, top + cellSize / 2, cellSize / 2);
+             const radius = cellSize * 0.3;
+             drawO(ctx, left + cellSize / 2, top + cellSize / 2, radius);
          }
      });
  }

```
### Interactions

Everything seems to be done, the only thing left – interactions.
Let's start with cleanup:

📄 src/index.js
```diff

  const { canvas, ctx } = setupCanvas();

- turn(GameState, 0, 1);
- turn(GameState, 1, 1);
- turn(GameState, 2, 0);
-
  draw(canvas, ctx, GameState);

```
Add click listener and calculate clicked row and col

📄 src/index.js
```diff
  const { canvas, ctx } = setupCanvas();

  draw(canvas, ctx, GameState);
+
+ canvas.addEventListener('click', ({ layerX, layerY }) => {
+     const row = Math.floor(layerY / canvas.height * 100 / 33);
+     const col = Math.floor(layerX / canvas.width * 100 / 33);
+ });

```
Pass row and col indices to game loop generator

📄 src/index.js
```diff
  canvas.addEventListener('click', ({ layerX, layerY }) => {
      const row = Math.floor(layerY / canvas.height * 100 / 33);
      const col = Math.floor(layerX / canvas.width * 100 / 33);
+
+     game.next([row, col]);
  });

```
and reflect game state changes on canvas

📄 src/index.js
```diff
      const col = Math.floor(layerX / canvas.width * 100 / 33);

      game.next([row, col]);
+     draw(canvas, ctx, GameState);
  });

```
Now let's congratulate a winner

📄 src/index.js
```diff

          winner = getWinner(gameState);
      }
+
+     setTimeout(() => {
+         alert(`Congratulations, ${['X', 'O'][winner]}! You won!`);
+     });
  }

  const game = gameLoop(GameState);

```
Oh, we forgot to handle a draw! No worries. Let's add `isGameFinished` helper:

📄 src/game-state.js
```diff

      return winner;
  }
+
+ export function isGameFinished(gameState) {
+     return gameState.field.every(f => f >= 0);
+ }

```
and call it on each iteration of a game loop

📄 src/index.js
```diff
- import { GameState, getWinner, turn } from './game-state.js';
+ import { GameState, getWinner, turn, isGameFinished } from './game-state.js';
  import { setupCanvas } from './canvas-setup.js';
  import { draw } from './renderer.js';

  function* gameLoop(gameState) {
      let winner = -1;

-     while (winner < 0) {
+     while (winner < 0 && !isGameFinished(gameState)) {
          const [rowIndex, colIndex] = yield;
          turn(gameState, rowIndex, colIndex);

      }

      setTimeout(() => {
-         alert(`Congratulations, ${['X', 'O'][winner]}! You won!`);
+         if (winner < 0) {
+             alert(`It's a draw`);
+         } else {
+             alert(`Congratulations, ${['X', 'O'][winner]}! You won!`);
+         }
      });
  }


```

## LICENSE

[WTFPL](http://www.wtfpl.net/)
