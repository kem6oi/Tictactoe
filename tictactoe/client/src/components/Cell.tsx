import React from 'react';
import { CellState } from '../types';

interface CellProps {
  value: CellState;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isWinning, disabled }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-color)',
        transition: 'background 0.3s',
        cursor: disabled ? 'default' : 'pointer',
        background: isWinning ? 'rgba(232, 160, 191, 0.08)' : 'transparent',
        boxShadow: isWinning ? '0 0 20px rgba(232, 160, 191, 0.2)' : 'none',
      }}
      className="cell-hover"
    >
      <style>{`.cell-hover:hover { background: rgba(255, 255, 255, 0.03) !important; }`}</style>
      {value === 'X' && <XMark winning={isWinning} />}
      {value === 'O' && <OMark winning={isWinning} />}
    </div>
  );
};

function XMark({ winning }: { winning: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" className={winning ? "winPulse" : "popIn"}>
      <line x1="15" y1="15" x2="45" y2="45" stroke="var(--nasty-color)" strokeWidth="5" strokeLinecap="round"
        style={{ strokeDasharray: 45, strokeDashoffset: 45, animation: "drawLine 0.25s ease-out forwards" }} />
      <line x1="45" y1="15" x2="15" y2="45" stroke="var(--nasty-color)" strokeWidth="5" strokeLinecap="round"
        style={{ strokeDasharray: 45, strokeDashoffset: 45, animation: "drawLine 0.25s ease-out 0.1s forwards" }} />
    </svg>
  );
}

function OMark({ winning }: { winning: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" className={winning ? "winPulse" : "popIn"}>
      <circle cx="30" cy="30" r="18" fill="none" stroke="var(--mild-color)" strokeWidth="5" strokeLinecap="round"
        style={{ strokeDasharray: 114, strokeDashoffset: 114, animation: "drawCircle 0.35s ease-out forwards" }} />
    </svg>
  );
}

export default Cell;
