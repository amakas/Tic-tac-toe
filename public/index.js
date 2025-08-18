import { findBestMove } from "./minimax.js";
const tiles = document.querySelectorAll(".tile");
const main = document.querySelector(".main");
const turn = document.querySelector(".turn");
const title = document.querySelector(".title");
const playAgain = document.getElementById("local");
const playBot = document.getElementById("bot");
const playDifficultBot = document.getElementById("superBot");
const win = document.createElement("div");
win.className = "win";
const winSound = new Audio("/Sounds/win.mp3");
const drawSound = new Audio("/Sounds/yay.mp3");
const lossSound = new Audio("/Sounds/loss.mp3");
let myTurn = true;
let isDisable = false;
let gameWithBot = false;
let gameOver = true;
let gameWithSuperBot = false;
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let state = Array(9).fill(null);

const onClick = (tile) => {
  if (tile.textContent) {
    return;
  }
  if (gameOver) return;
  if (myTurn) {
    const index = Array.from(tiles).indexOf(tile);
    state[index] = "x";
    tile.innerHTML = "X";
    myTurn = !myTurn;
    turn.textContent = "Opponent turn";
    console.log(state);
    win.innerHTML = "X Won";
    checkWinner(state);
    if (gameWithBot && !myTurn && !gameOver) {
      setTimeout(() => {
        normalBotMove();
      }, 1000);
    }
    if (gameWithSuperBot && !myTurn && !gameOver) {
      setTimeout(() => {
        const { row, col } = findBestMove(to2D(state));
        let idx = to1DIndex(row, col);
        console.log(idx);
        const empty = state
          .map((el, i) => (!el ? i : null))
          .filter((el) => el !== null);
        const randomChance = Math.random() * 100;
        if (randomChance < 10) {
          idx = empty[Math.floor(Math.random() * empty.length)];
        }
        superBotMove(idx);
      }, 1000);
    }
  } else {
    if (!gameWithBot && !gameWithSuperBot) {
      const index = Array.from(tiles).indexOf(tile);
      state[index] = "o";
      tile.innerHTML = "O";
      myTurn = !myTurn;
      turn.textContent = "Your turn";

      win.innerHTML = "O Won";
      checkWinner(state);
    }
  }
};

tiles.forEach((tile) => {
  tile.addEventListener("click", () => onClick(tile));
});

const checkWinner = (arr) => {
  winningCombos.forEach((item) => {
    if (
      arr[item[0]] &&
      arr[item[0]] === arr[item[1]] &&
      arr[item[1]] === arr[item[2]]
    ) {
      document.body.append(win);

      if (arr[item[0]] === "x") {
        winSound.currentTime = 2;
        winSound.play();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        document.body.setAttribute("class", " red");
        lossSound.currentTime = 0;
        lossSound.play();
      }

      for (let i = 0; i < state.length; i++) {
        state[i] = null;
      }
      gameOver = true;
      gameWithBot = false;
      playAgain.removeAttribute("disabled");
      playAgain.setAttribute("class", "play-again");
      playBot.removeAttribute("disabled");
      playBot.setAttribute("class", "play-again");
      playDifficultBot.removeAttribute("disabled");
      playDifficultBot.setAttribute("class", "play-again super");
    }
  });
  let isDraw = arr.every((el) => el);
  if (isDraw) {
    win.textContent = "Draw";
    document.body.append(win);
    drawSound.currentTime = 0;
    drawSound.play();
    gameOver = true;
    gameWithBot = false;
    playAgain.removeAttribute("disabled");
    playAgain.setAttribute("class", "play-again");
    playBot.removeAttribute("disabled");
    playBot.setAttribute("class", "play-again");
    playDifficultBot.removeAttribute("disabled");
    playDifficultBot.setAttribute("class", "play-again super");
    state.fill(null);
  }
  if (gameOver) {
    main.setAttribute("class", "main blur");
    title.setAttribute("class", "title blur");
  }
};

const handlePlay = () => {
  tiles.forEach((item) => (item.innerHTML = ""));
  state.fill(null);
  gameOver = false;
  myTurn = true;
  isDisable = true;
  gameWithBot = false;
  gameWithSuperBot = false;
  turn.textContent = "Your turn";
  playAgain.setAttribute("class", "disabled");
  playAgain.setAttribute("disabled", "true");
  playBot.setAttribute("disabled", "true");
  playBot.setAttribute("class", "disabled");
  playDifficultBot.setAttribute("disabled", "true");
  playDifficultBot.setAttribute("class", "disabled super");
  main.classList.remove("blur");
  title.classList.remove("blur");
  if (document.body.contains(win)) {
    document.body.removeChild(win);
    document.body.classList.remove("red");
  }
};

const handleSuperBotClick = () => {
  tiles.forEach((item) => (item.innerHTML = ""));
  state.fill(null);
  gameWithSuperBot = true;
  gameOver = false;
  myTurn = true;
  isDisable = true;
  gameWithBot = false;
  playBot.setAttribute("disabled", "");
  playAgain.setAttribute("disabled", "");
  playDifficultBot.setAttribute("disabled", "");
  turn.textContent = "Your turn";
  playAgain.setAttribute("class", "disabled");
  playBot.setAttribute("class", "disabled");
  playDifficultBot.setAttribute("class", "disabled super");
  main.classList.remove("blur");
  title.classList.remove("blur");
  if (document.body.contains(win)) {
    document.body.removeChild(win);
    document.body.classList.remove("red");
  }
};
const normalBotMove = () => {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (state[a] === "o" && state[b] === "o" && !state[c])
      return makeMove(c, "o");
    if (state[a] === "o" && state[c] === "o" && !state[b])
      return makeMove(b, "o");
    if (state[c] === "o" && state[b] === "o" && !state[a])
      return makeMove(a, "o");
  }
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (state[a] === "x" && state[b] === "x" && !state[c])
      return makeMove(c, "o");
    if (state[a] === "x" && state[c] === "x" && !state[b])
      return makeMove(b, "o");
    if (state[c] === "x" && state[b] === "x" && !state[a])
      return makeMove(a, "o");
  }

  if (!state[4]) return makeMove(4, "o");

  const corners = [0, 2, 6, 8].filter((el) => !state[el]);
  if (corners.length)
    return makeMove(corners[Math.floor(Math.random() * corners.length)], "o");

  const empty = state.map((v, i) => (v ? null : i)).filter((v) => v !== null);
  if (empty.length)
    return makeMove(empty[Math.floor(Math.random() * empty.length)], "o");
};

function makeMove(index, symbol) {
  state[index] = symbol;
  tiles[index].innerHTML = symbol.toUpperCase();
  myTurn = true;
  turn.textContent = "Your turn";
  win.textContent = "O Won";
  checkWinner(state);
}

const handleBotClick = () => {
  tiles.forEach((item) => (item.innerHTML = ""));
  state.fill(null);
  gameWithBot = true;
  gameOver = false;
  myTurn = true;
  isDisable = true;
  gameWithSuperBot = false;
  turn.textContent = "Your turn";
  playAgain.setAttribute("class", "disabled");
  playBot.setAttribute("disabled", "");
  playAgain.setAttribute("disabled", "");
  playBot.setAttribute("class", "disabled");
  playDifficultBot.setAttribute("disabled", "");
  playDifficultBot.setAttribute("class", "disabled super");
  main.classList.remove("blur");
  title.classList.remove("blur");
  if (document.body.contains(win)) {
    document.body.removeChild(win);
    document.body.classList.remove("red");
  }
};

const to2D = (s) => [
  [s[0], s[1], s[2]],
  [s[3], s[4], s[5]],
  [s[6], s[7], s[8]],
];
const to1DIndex = (r, c) => r * 3 + c;

const superBotMove = (i) => {
  state[i] = "o";
  tiles[i].innerHTML = "O";
  myTurn = true;
  turn.textContent = "Your turn";
  win.textContent = "O Won";
  checkWinner(state);
};
playAgain.addEventListener("click", handlePlay);
playBot.addEventListener("click", handleBotClick);
playDifficultBot.addEventListener("click", handleSuperBotClick);
