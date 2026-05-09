import React, { useEffect } from 'react';
import { Reaction } from '../types';

interface FloatingReactionsProps {
  reactions: Reaction[];
  onRemove: (id: number) => void;
}

const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions, onRemove }) => {
  return (
    <>
      {reactions.map((r) => (
        <ReactionItem key={r.id} reaction={r} onDone={() => onRemove(r.id)} />
      ))}
    </>
  );
};

const ReactionItem: React.FC<{ reaction: Reaction; onDone: () => void }> = ({ reaction, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  const leftPos = 20 + Math.random() * 60;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 120,
        left: `${leftPos}%`,
        fontSize: 36,
        animation: "floatUp 1.8s ease-out forwards",
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      {reaction.emoji}
    </div>
  );
};

export default FloatingReactions;
