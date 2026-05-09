import { CellState, GameState, Symbol } from "./types";

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const checkWinner = (board: CellState[]): { winner: Symbol | "draw" | null, winningIndices: number[] | null } => {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Symbol, winningIndices: pattern };
    }
  }

  if (board.every(cell => cell !== null)) {
    return { winner: "draw", winningIndices: null };
  }

  return { winner: null, winningIndices: null };
};

export const createInitialGameState = (): GameState => ({
  board: Array(9).fill(null),
  currentTurn: "X",
  winner: null,
  winningIndices: null
});
