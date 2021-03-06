var canvas = document.getElementById("mycanvas");
var scoreTag = document.getElementById("score");
var settingsTag = document.getElementById("settings");
var divAffichage = document.getElementById("divAffichage");
var divCanvas = document.getElementById("divCanvas");
var ctx = [];
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";

let grid = [];
let direction = "none";
let lastDirection = "none";
let lose = true;
let level = {};
let selectedLevel = 1;

let options = [1, 2, 3, 4, 5];

let score = 0;

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function updateAffichage() {
  while (divAffichage.firstChild) {
    divAffichage.removeChild(divAffichage.lastChild);
  }

  if (!lose) {
    let scoreTag = document.createElement("p");
    scoreTag.appendChild(document.createTextNode("Score : " + score));
    divAffichage.appendChild(scoreTag);

    if (!document.getElementById("btnLose")) {
      let btn = document.createElement("button");
      btn.textContent = "Stop";
      btn.id = "btnLose";
      btn.onclick = () => {
        lose = true;
        updateAffichage();
      };
      insertAfter(btn, divCanvas);
    }
  } else {
    if (document.getElementById("btnLose"))
      document.getElementById("btnLose").remove();
    let info = document.createElement("p");
    info.appendChild(document.createTextNode("Choix du niveau : "));
    divAffichage.appendChild(info);

    let selectList = document.createElement("select");
    selectList.id = "settingSelect";
    selectList.onchange = (e) => {
      selectedLevel = e.target.value;
      load_level();
      selectList.blur();
    };
    divAffichage.appendChild(selectList);

    for (let i = 0; i < options.length; i++) {
      let option = document.createElement("option");
      option.value = options[i];
      option.text = options[i];
      selectList.appendChild(option);
    }

    let btn = document.createElement("button");
    btn.textContent = "Start";
    btn.id = "btnStart";
    btn.onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.width);
      score = 0;
      lose = false;
      lastDirection = "none";
      load_level();
    };
    divAffichage.appendChild(btn);
  }
}

function isArrayInArray(array1, array2) {
  if (typeof array1 === "object" && typeof array2 === "object")
    return array2.some(
      (a) => array1.length && array1.every((v, i) => v === a[i])
    );
  return false;
}

function load_level() {
  var url = "level" + selectedLevel + ".json";
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.onerror = function () {
    console.log("erreur de chargement");
  };
  req.onload = function () {
    if (req.status === 200) {
      let data = JSON.parse(req.responseText);
      level.dimension = data.dimension;
      level.delay = data.delay;
      level.walls = data.walls;
      level.food = data.food;
      level.snake = data.snake;
      level.evolution = data.evolution;

      createGrid();
    } else {
      console.log("Erreur " + req.status);
    }
  };
  req.send();
}

function createGrid() {
  grid = [];
  for (i = 0; i < level.dimension; i++) {
    grid.push([]);
    for (j = 0; j < level.dimension; j++) {
      let current = [i, j];
      if (isArrayInArray(current, level.food)) {
        grid[i].push("food");
      } else if (isArrayInArray(current, level.snake)) {
        grid[i].push("snake");
      } else if (isArrayInArray(current, level.walls)) {
        grid[i].push("wall");
      } else {
        grid[i].push("empty");
      }
    }
  }
  displayGrid();
}

function displayGrid() {
  let cellSize = canvas.width / grid.length;

  let snakeHead = level.snake[0];

  for (i in grid) {
    for (j in grid[i]) {
      let k = i * canvas.width + j;
      ctx[k] = canvas.getContext("2d");
      ctx[k].beginPath();
      switch (grid[i][j]) {
        case "empty":
          ctx[k].fillStyle = "#FFFFFF";
          break;
        case "snake":
          let current = [i, j];
          if (snakeHead.toString() === current.toString()) {
            ctx[k].fillStyle = "#132a13";
          } else {
            random = Math.floor(Math.random() * 4);
            switch (random) {
              case 0:
                ctx[k].fillStyle = "#31572c";
                break;
              case 1:
                ctx[k].fillStyle = "#4f772d";
                break;
              case 2:
                ctx[k].fillStyle = "#90a955";
                break;
              case 3:
                ctx[k].fillStyle = "#63aa30";
                break;
            }
          }
          break;
        case "food":
          ctx[k].fillStyle = "#ff3711";
          break;
        case "wall":
          ctx[k].fillStyle = "#000000";
          break;
      }
      ctx[k].rect(j * cellSize, i * cellSize, cellSize, cellSize);
      ctx[k].fill();
      ctx.stroke();
    }
  }
}

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      if (lastDirection !== "right") direction = "left";
      break;
    case 38:
      if (lastDirection !== "down") direction = "up";
      break;
    case 39:
      if (lastDirection !== "left") direction = "right";
      break;
    case 40:
      if (lastDirection !== "up") direction = "down";
      break;
  }
  if (lastDirection === "none") move();
};

function updateGrid() {
  for (i in grid) {
    for (j in grid[i]) {
      if (grid[i][j] === "snake") {
        grid[i][j] = "empty";
      }
      for (k in level.snake) {
        if (level.snake[k].toString() === [i, j].toString()) {
          grid[i][j] = "snake";
        }
      }
      for (k in level.food) {
        if (level.food[k].toString() === [i, j].toString()) {
          grid[i][j] = "food";
        }
      }
    }
  }
  displayGrid();
}

function move() {
  let counter = level.delay;
  if (direction !== "none" && !lose) {
    switch (direction) {
      case "right":
        level.snake.unshift([level.snake[0][0], level.snake[0][1] + 1]);
        lastDirection = "right";
        break;
      case "down":
        level.snake.unshift([level.snake[0][0] + 1, level.snake[0][1]]);
        lastDirection = "down";
        break;
      case "left":
        level.snake.unshift([level.snake[0][0], level.snake[0][1] - 1]);
        lastDirection = "left";
        break;
      case "up":
        level.snake.unshift([level.snake[0][0] - 1, level.snake[0][1]]);
        lastDirection = "up";
        break;
    }
    let snakeBody = level.snake.slice(0, level.snake.lenght);
    snakeBody.shift();
    if (
      level.snake[0][0] < 0 ||
      level.snake[0][0] > level.dimension ||
      level.snake[0][1] < 0 ||
      level.snake[0][1] > level.dimension ||
      isArrayInArray(level.snake[0], level.walls) ||
      isArrayInArray(level.snake[0], snakeBody)
    ) {
      lose = true;
    }

    if (isArrayInArray(level.snake[0], level.food)) {
      for (k in level.food) {
        if (level.food[k].toString() === level.snake[0].toString()) {
          level.food.splice(k, 1);
        }
      }
      newFood();
      score++;
      level.delay = level.delay / level.evolution;
    } else {
      level.snake.pop();
    }
    updateGrid();
    updateAffichage();
    if (!lose) setTimeout(move, counter);
  }
}

function newFood() {
  do {
    xFood = Math.floor(Math.random() * level.dimension);
    yFood = Math.floor(Math.random() * level.dimension);
  } while (grid[xFood][yFood] !== "empty");

  level.food.push([xFood, yFood]);
}

window.addEventListener("load", function () {
  load_level();
  updateAffichage();
});
