import React from 'react';
import { Symbol } from '../types';

interface CellProps {
  value: Symbol | null;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isWinning, disabled }) => {
  return (
    <div
      className={`cell ${isWinning ? 'winning' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      {value === 'X' && (
        <svg className="symbol-svg" viewBox="0 0 100 100">
          <path
            d="M 20 20 L 80 80 M 80 20 L 20 80"
            fill="none"
            stroke="var(--tomato-red)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      )}
      {value === 'O' && (
        <svg className="symbol-svg" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="35"
            fill="none"
            stroke="var(--cobalt-blue)"
            strokeWidth="12"
          />
        </svg>
      )}
    </div>
  );
};

export default Cell;
