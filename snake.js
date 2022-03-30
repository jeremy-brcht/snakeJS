var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";
ctx.fillRect(
  canvas.width / 4,
  canvas.height / 4,
  canvas.width / 2,
  canvas.height / 2
);
