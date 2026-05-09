import React, { useState } from 'react';
import '../styles/home.css';

interface HomeScreenProps {
  onCreateGame: () => void;
  onJoinGame: (code: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateGame, onJoinGame }) => {
  const [code, setCode] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoinGame(code.trim().toUpperCase());
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">TIC TAC TOE</h1>
      <div className="home-card card">
        <button className="primary-button" onClick={onCreateGame}>
          CREATE GAME
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleJoin} className="input-group">
          <label htmlFor="invite-code">ENTER INVITE CODE</label>
          <input
            id="invite-code"
            type="text"
            className="home-input"
            placeholder="ABC-123"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={7}
          />
          <button type="submit" className="secondary-button" disabled={!code.trim()}>
            JOIN GAME
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeScreen;
