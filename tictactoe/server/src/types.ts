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

export interface Player {
  id: string;
  symbol: Symbol;
}

export interface Room {
  code: string;
  players: Player[];
  gameState: GameState;
  messages: ChatMessage[];
  lastActivity: number;
  rematchRequested: Set<string>; // Set of player IDs who requested rematch
}
