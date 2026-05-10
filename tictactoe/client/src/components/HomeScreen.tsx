import React from 'react';

interface HomeScreenProps {
  onCreateGame: () => void;
  onJoinGame: (code: string) => void;
  isJoining?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateGame, onJoinGame, isJoining }) => {
  const [joinCode, setJoinCode] = React.useState('');

  return (
    <div style={{
      width: '100%',
      maxWidth: 520,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
      padding: '40px 20px'
    }}>
      <div className="playfair" style={{
        fontSize: 'clamp(36px, 8vw, 56px)',
        fontWeight: 700,
        letterSpacing: '-1px',
        textAlign: 'center'
      }}>
        dare tac toe
      </div>
      <div style={{ color: 'var(--text-dim)', fontSize: 15, textAlign: 'center' }}>
        a game of strategy, risk, and revelation.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {isJoining ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div className="spinner" style={{
              width: '24px',
              height: '24px',
              border: '3px solid var(--accent-color)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ color: 'var(--text-light)' }}>Joining room...</div>
          </div>
        ) : (
          <>
            <button className="primary-button" onClick={onCreateGame}>
              CREATE GAME →
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="ENTER CODE"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '100px',
                  padding: '14px 24px',
                  color: 'var(--text-light)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                className="primary-button"
                style={{ padding: '14px 24px' }}
                onClick={() => onJoinGame(joinCode)}
                disabled={!joinCode}
              >
                JOIN →
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="card" style={{ width: '100%', padding: '20px 24px' }}>
        <div className="playfair" style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 10 }}>how to play</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Two players take turns. X goes first. Get three in a row — winner picks a dare for the loser. Dare done = 1 point. Chicken out = shame forever. 🐔
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
