import React from 'react';
import { Symbol } from '../types';

interface GameStatusProps {
  winner: Symbol | 'draw' | null;
  currentTurn: Symbol;
  mySymbol: Symbol;
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, currentTurn, mySymbol }) => {
  return (
    <div style={{ marginBottom: '1rem', fontFamily: 'Fredoka One', fontSize: '1.5rem' }}>
      {winner ? (
        winner === 'draw' ? (
          <span style={{ color: 'var(--text-dark)' }}>IT'S A DRAW! 🤝</span>
        ) : (
          <span style={{ color: winner === 'X' ? 'var(--tomato-red)' : 'var(--cobalt-blue)' }}>
            PLAYER {winner} WINS! 🎉
          </span>
        )
      ) : (
        <span>
          TURN: <span style={{ color: currentTurn === 'X' ? 'var(--tomato-red)' : 'var(--cobalt-blue)' }}>
            PLAYER {currentTurn} {currentTurn === mySymbol ? '(YOU)' : ''}
          </span>
        </span>
      )}
    </div>
  );
};

export default GameStatus;
