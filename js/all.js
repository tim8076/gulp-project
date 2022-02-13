"use strict";

// 遊戲開始畫面
var gameIndexView = document.querySelector('[data-game-start]');
var startGameButton = document.querySelector('[data-game-start-button]');
var gamingView = document.querySelector('[data-gaming]');

var startGame = function startGame() {
  gameIndexView.classList.add('d-none');
  document.body.classList.add('bg-primary');
  gamingView.classList.remove('d-none');
};

startGameButton.addEventListener('click', startGame); // 讀取指定cookie

function getCookie(name) {
  var value = "; ".concat(document.cookie);
  var parts = value.split("; ".concat(name, "="));
  if (parts.length === 2) return parts.pop().split(';').shift();
} // 遊戲進行中


var xScoreBoard = document.querySelector('[data-x-score]');
var oScoreBoard = document.querySelector('[data-o-score]');
var xScore = Number(getCookie('xScore')) || 0;
var oScore = Number(getCookie('oScore')) || 0;
console.log(xScore, oScore);
var gameBoard = document.querySelector('.game-grid-container.gaming');
var grids = document.querySelectorAll('.game-grid-container.gaming .col');
var resultViews = document.querySelectorAll('[data-result-win]');
var currentTurn = 'o';
var winMatch = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
var oMatch = [];
var xMatch = [];
var winner;
var turnCount = 1;

var switchTurn = function switchTurn() {
  turnCount += 1;

  if (currentTurn === 'o') {
    gamingView.classList.remove('o-turn');
    gamingView.classList.add('x-turn');
    currentTurn = 'x';
  } else {
    gamingView.classList.remove('x-turn');
    gamingView.classList.add('o-turn');
    currentTurn = 'o';
  }
};

var checkWinner = function checkWinner(currentMatch) {
  var win = false;
  winMatch.forEach(function (match) {
    var isWin = match.every(function (num) {
      return currentMatch.includes(num);
    });
    if (isWin) win = true;
  });
  return win;
};

var setScore = function setScore(scoreBoard, score) {
  scoreBoard.innerText = score;
};

var showResult = function showResult(winner) {
  resultViews.forEach(function (view) {
    view.classList.add('d-none');

    if (view.classList.contains(winner)) {
      view.classList.remove('d-none');
    }
  });
};

var playGame = function playGame(e) {
  if (e.currentTarget.childNodes.length) return;
  var targetNum = parseInt(e.target.dataset.num);

  if (currentTurn === 'o') {
    e.currentTarget.innerHTML = '<i class="fa-regular fa-circle"></i>';
    oMatch.push(targetNum);

    if (checkWinner(oMatch)) {
      oScore += 1;
      setScore(oScoreBoard, oScore);
      document.cookie = "oScore=".concat(oScore);
      gameBoard.classList.add('d-none');
      showResult('o-win');
      return;
    }
  }

  if (currentTurn === 'x') {
    e.currentTarget.innerHTML = '<i class="fa-solid fa-x"></i>';
    xMatch.push(targetNum);

    if (checkWinner(xMatch)) {
      xScore += 1;
      setScore(xScoreBoard, xScore);
      document.cookie = "xScore=".concat(xScore);
      gameBoard.classList.add('d-none');
      showResult('x-win');
      return;
    }
  } // 平手時


  if (turnCount >= 9) {
    gameBoard.classList.add('d-none');
    showResult('draw');
  } else {
    switchTurn();
  }
};

grids.forEach(function (grid) {
  grid.addEventListener('click', playGame);
}); // 再玩一次

var restartGameButton = document.querySelector('[data-restart-game-button]');

var restartGame = function restartGame() {
  resultViews.forEach(function (view) {
    return view.classList.add('d-none');
  });
  grids.forEach(function (grid) {
    return grid.innerHTML = '';
  });
  turnCount = 1;
  oMatch.length = 0;
  xMatch.length = 0;
  gameBoard.classList.remove('d-none');
};

restartGameButton.addEventListener('click', restartGame); // 初始化

var init = function init() {
  xScoreBoard.innerText = xScore;
  oScoreBoard.innerText = oScore;
};

init();
//# sourceMappingURL=all.js.map
