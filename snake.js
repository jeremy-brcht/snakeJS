var canvas = document.getElementById("mycanvas");
var ctx = [];
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";

let grid = [];
let direction = "none";

let snake = [];
let food = [];

let score = 0;

function displayGrid() {
  let cellSize = canvas.width / grid.length;

  for (i in grid) {
    for (j in grid[i]) {
      let k = i * canvas.width + j;
      ctx[k] = canvas.getContext("2d");
      ctx[k].beginPath();
      switch (grid[i][j]) {
        case "vide":
          ctx[k].fillStyle = "#FFFFFF";
          break;
        case "snake":
          ctx[k].fillStyle = "#63aa30";
          break;
        case "food":
          ctx[k].fillStyle = "#ff3711";
          break;
      }
      ctx[k].rect(i * cellSize, j * cellSize, cellSize, cellSize);
      ctx[k].fill();
      ctx.stroke();
    }
  }
}

function createEmptyGrid(size) {
  for (i = 0; i < size; i++) {
    grid.push([]);
    for (j = 0; j < size; j++) {
      grid[i].push("vide");
    }
  }
}

function addToEmptyGrid() {
  xSnake = Math.floor(Math.random() * grid.length);
  ySnake = Math.floor(Math.random() * grid.length);

  do {
    xFood = Math.floor(Math.random() * grid.length);
    yFood = Math.floor(Math.random() * grid.length);
  } while (xSnake !== xFood && ySnake !== yFood);

  grid[xSnake][ySnake] = "snake";
  snake.push([xSnake, ySnake]);

  grid[xFood][yFood] = "food";
  food[0] = xFood;
  food[1] = yFood;
}

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      direction = "left";
      break;
    case 38:
      direction = "up";
      break;
    case 39:
      direction = "right";
      break;
    case 40:
      direction = "down";
      break;
  }
};

function updateGrid() {
  for (i in grid) {
    for (j in grid[i]) {
      if (grid[i][j] === "snake") {
        grid[i][j] = "vide";
      }
      for (k in snake) {
        if (snake[k][0].toString() === i && snake[k][1].toString() === j) {
          grid[i][j] = "snake";
        }
      }
    }
  }

  console.log(grid);
  displayGrid();
}

function newFood() {
  do {
    xFood = Math.floor(Math.random() * grid.length);
    yFood = Math.floor(Math.random() * grid.length);
  } while (snake.includes([xFood, yFood]));

  grid[xFood][yFood] = "food";
  food[0] = xFood;
  food[1] = yFood;
}

function move() {
  if (direction !== "none") {
    switch (direction) {
      case "right":
        snake.unshift([snake[0][0] + 1, snake[0][1]]);
        break;
      case "down":
        snake.unshift([snake[0][0], snake[0][1] + 1]);
        break;
      case "left":
        snake.unshift([snake[0][0] - 1, snake[0][1]]);
        break;
      case "up":
        snake.unshift([snake[0][0], snake[0][1] - 1]);
        break;
    }
    if (snake[0].toString() !== food.toString()) {
      snake.pop();
    } else {
      newFood();
      score++;
    }
    updateGrid();
  }
}

setInterval(move, 500);

createEmptyGrid(20);
addToEmptyGrid();

displayGrid();
console.log(grid);
