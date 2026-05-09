import React, { useState, useEffect } from 'react';
import { GameState, Symbol, DareStatus } from '../types';

interface DareRevealProps {
  gameState: GameState;
  mySymbol: Symbol;
  onStatusUpdate: (status: DareStatus) => void;
  onRematch: () => void;
  onReturnHome: () => void;
}

const DareReveal: React.FC<DareRevealProps> = ({ gameState, mySymbol, onStatusUpdate, onRematch, onReturnHome }) => {
  const [typewritten, setTypewritten] = useState("");
  const { tier, currentDare, dareFor, dareStatus, scores, winner } = gameState;

  useEffect(() => {
    setTypewritten("");
    let i = 0;
    const speed = tier === 'mild' ? 38 : tier === 'spicy' ? 55 : 80;
    const interval = setInterval(() => {
      setTypewritten(currentDare.slice(0, i + 1));
      i++;
      if (i >= currentDare.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [currentDare, tier]);

  const tierColors = { mild: "#FFD700", spicy: "#FF8C42", nasty: "#E8A0BF" };
  const tierEmoji = { mild: "🟡", spicy: "🟠", nasty: "🔴" };

  const isMyDare = dareFor === mySymbol;

  return (
    <div style={{
      width: "100%",
      maxWidth: 480,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
      padding: "40px 20px",
      margin: "0 auto",
      boxSizing: "border-box"
    }}>
      {tier === 'nasty' && <div className="nasty-spotlight" />}
      <div className="playfair" style={{ fontSize: 14, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 3 }}>
        dare for player {dareFor} {isMyDare ? "(You)" : ""}
      </div>

      <div style={{
        border: `1px solid ${tierColors[tier || 'mild']}`,
        borderRadius: 100,
        padding: "4px 16px",
        fontSize: 13,
        color: tierColors[tier || 'mild']
      }}>
        {tierEmoji[tier || 'mild']} {tier}
      </div>

      <div className={`card ${tier === 'spicy' ? 'spicy-glow' : tier === 'nasty' ? 'nasty-glow' : ''}`} style={{
        padding: "36px 32px",
        width: "100%",
        minHeight: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div className="playfair" style={{
          fontSize: tier === 'mild' ? "22px" : "26px",
          lineHeight: 1.6,
          color: "var(--text-light)"
        }}>
          {typewritten}<span className="cursor">|</span>
        </div>
      </div>

      {!dareStatus && isMyDare && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => onStatusUpdate("done")}
            className={`primary-button ${tier === 'spicy' ? 'spicy-btn-pulse' : ''}`}
            style={{
              borderColor: tier === 'mild' ? 'var(--mild-color)' : tier === 'spicy' ? 'var(--spicy-color)' : 'var(--nasty-color)',
              color: tier === 'mild' ? 'var(--mild-color)' : tier === 'spicy' ? 'var(--spicy-color)' : 'var(--nasty-color)'
            }}
          >
            done 😈
          </button>
          <button
            onClick={() => onStatusUpdate("chickened")}
            className="primary-button"
            style={{ borderColor: "#555", color: "#888" }}
          >
            chicken out 🐔
          </button>
        </div>
      )}

      {!dareStatus && !isMyDare && (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Waiting for Player {dareFor} to respond...
          </div>
      )}

      {dareStatus && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div className="playfair" style={{
              color: dareStatus === "done" ? "#E8A0BF" : "#888",
              fontSize: 22
          }}>
            {dareStatus === "done" ? "well played 😏" : "🐔 added to the record"}
          </div>
          <button onClick={onRematch} className="primary-button" style={{ marginTop: 24 }}>rematch →</button>
          <button onClick={onReturnHome} style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 14,
              marginTop: 8,
              textDecoration: "underline",
              cursor: "pointer"
          }}>
              change heat level
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 20, fontSize: 14, color: "var(--text-dim)", alignItems: "center", marginTop: 20 }}>
          <span>X: {scores.X} wins {scores.Xchicken > 0 ? `| 🐔×${scores.Xchicken}` : ""}</span>
          <span style={{ color: "#444" }}>·</span>
          <span>O: {scores.O} wins {scores.Ochicken > 0 ? `| 🐔×${scores.Ochicken}` : ""}</span>
      </div>
    </div>
  );
};

export default DareReveal;
