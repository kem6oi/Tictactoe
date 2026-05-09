export type Symbol = "X" | "O";

export type CellState = Symbol | null;

export type Tier = "mild" | "spicy" | "nasty" | null;
export type DareStatus = "done" | "chickened" | null;

export interface Scores {
  X: number;
  O: number;
  Xchicken: number;
  Ochicken: number;
}

export interface ChatMessage {
  sender: Symbol;
  text: string;
  timestamp: number;
}

export interface GameState {
  board: CellState[];
  currentTurn: Symbol;
  winner: Symbol | "draw" | null;
  winningIndices: number[] | null;
  tier: Tier;
  currentDare: string;
  dareFor: Symbol | null;
  dareStatus: DareStatus;
  scores: Scores;
}

export interface Reaction {
  emoji: string;
  id: number;
}
