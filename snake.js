var canvas = document.getElementById("mycanvas");
var ctx = [];
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";
ctx.fillStyle = "#00FF00";

let grid = [];

function displayGrid(grid) {
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
          console.log(i, j);
          break;
        case "food":
          ctx[k].fillStyle = "#ff3711";
          break;
      }
      ctx[k].rect(i * cellSize, j * cellSize, cellSize, cellSize);
      ctx[k].fill();
      ctx[k].stroke();
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

function addToGrid(grid) {
  xSnake = Math.floor(Math.random() * grid.length);
  ySnake = Math.floor(Math.random() * grid.length);

  do {
    xFood = Math.floor(Math.random() * grid.length);
    yFood = Math.floor(Math.random() * grid.length);
  } while (xSnake !== xFood && ySnake !== yFood);

  grid[xSnake][ySnake] = "snake";
  grid[xFood][yFood] = "food";
}

createEmptyGrid(20);
addToGrid(grid);

displayGrid(grid);
console.log(grid);
