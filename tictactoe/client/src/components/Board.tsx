import React from 'react';
import Cell from './Cell';
import { CellState } from '../types';

interface BoardProps {
  board: CellState[];
  onCellClick: (index: number) => void;
  winningIndices: number[] | null;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, winningIndices, disabled }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0,
      width: 300,
      height: 300,
      border: '1px solid var(--border-color)',
      borderRadius: 12,
      overflow: 'hidden'
    }}>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => !disabled && onCellClick(index)}
          isWinning={winningIndices?.includes(index) || false}
          disabled={disabled || !!cell}
        />
      ))}
    </div>
  );
};

export default Board;
