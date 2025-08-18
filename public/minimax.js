export function isMovesLeft(board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) return true;
    }
  }
  return false;
}

export function evaluate(board) {
  // рядки
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === "x") return +10;
      else if (board[row][0] === "o") return -10;
    }
  }

  // колонки
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === "x") return +10;
      else if (board[0][col] === "o") return -10;
    }
  }

  // діагоналі
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === "x") return +10;
    else if (board[0][0] === "o") return -10;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === "x") return +10;
    else if (board[0][2] === "o") return -10;
  }

  return 0;
}

export function minimax(board, depth, isMax) {
  let score = evaluate(board);

  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!isMovesLeft(board)) return 0;

  if (isMax) {
    let best = -1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = "x";
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i][j] = null;
        }
      }
    }
    return best;
  } else {
    let best = 1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          board[i][j] = "o";
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i][j] = null;
        }
      }
    }
    return best;
  }
}

export function findBestMove(board) {
  let bestVal = 1000;
  let bestMove = { row: -1, col: -1 };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) {
        board[i][j] = "o";
        let moveVal = minimax(board, 0, true);
        board[i][j] = null;

        if (moveVal < bestVal) {
          bestMove = { row: i, col: j };
          bestVal = moveVal;
        }
      }
    }
  }
  return bestMove;
}
