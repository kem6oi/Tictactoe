import React from 'react';
import Cell from './Cell';
import '../styles/board.css';
import { CellState } from '../types';

interface BoardProps {
  board: CellState[];
  onCellClick: (index: number) => void;
  winningIndices: number[] | null;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, winningIndices, disabled }) => {
  return (
    <div className="board-grid">
      {board.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          onClick={() => onCellClick(i)}
          isWinning={winningIndices?.includes(i) || false}
          disabled={disabled || cell !== null}
        />
      ))}
    </div>
  );
};

export default Board;
