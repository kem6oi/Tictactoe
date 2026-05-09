export type Symbol = "X" | "O";

export type CellState = Symbol | null;

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
}
