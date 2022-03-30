var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";

function createGrid(size) {
  let cellSize = canvas.width / size;

  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

createGrid(20);
