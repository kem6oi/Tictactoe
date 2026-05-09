import { CellState, GameState, Symbol, Tier, Scores } from "./types";

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const DARES = {
  mild: [
    "Tell me your most embarrassing moment 😳",
    "Do your best impression of me",
    "Tell me something you've never told anyone",
    "Show me the last photo on your camera roll",
    "Sing the first song that comes to mind",
  ],
  spicy: [
    "Send a voice note saying something you've never said out loud 🎤",
    "Show me something on your phone you'd normally hide 👀",
    "Describe your ideal night in exactly three words",
    "Tell me what you were really thinking the first time we met",
    "Read your last 5 search history items out loud 😏",
  ],
  nasty: [
    "Your dare goes here 😈",
    "Write your own here...",
    "You know what to put 🔥",
  ]
};

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

export const getRandomDare = (tier: Tier): string => {
  if (!tier || !DARES[tier]) return "";
  const pool = DARES[tier];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const createInitialGameState = (tier: Tier = null, scores?: Scores): GameState => ({
  board: Array(9).fill(null),
  currentTurn: "X",
  winner: null,
  winningIndices: null,
  tier,
  currentDare: "",
  dareFor: null,
  dareStatus: null,
  scores: scores || { X: 0, O: 0, Xchicken: 0, Ochicken: 0 }
});
