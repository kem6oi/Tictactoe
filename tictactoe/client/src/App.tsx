import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import HomeScreen from './components/HomeScreen';
import Board from './components/Board';
import ChatArea from './components/ChatArea';
import InviteCode from './components/InviteCode';
import DareReveal from './components/DareReveal';
import FloatingReactions from './components/FloatingReactions';
import { GameState, ChatMessage, Symbol, Tier, Reaction, DareStatus } from './types';
import './styles/global.css';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'lobby' | 'game' | 'dare'>('home');
  const [roomCode, setRoomCode] = useState('');
  const [mySymbol, setMySymbol] = useState<Symbol | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    socket.connect();

    const onRoomCreated = ({ code, symbol }: { code: string, symbol: Symbol }) => {
      setRoomCode(code);
      setMySymbol(symbol);
      setView('lobby');
      setError(null);
    };

    const onRoomJoined = ({ code, symbol }: { code: string, symbol: Symbol }) => {
      setRoomCode(code);
      setMySymbol(symbol);
      setOpponentJoined(true);
      setError(null);
      setView('lobby');
    };

    const onPlayerJoined = () => {
      setOpponentJoined(true);
    };

    const onGameUpdate = (state: GameState) => {
      setGameState(state);
      if (state.winner && state.winner !== 'draw' && !state.dareStatus) {
        setTimeout(() => setView('dare'), 1200);
      } else if (state.dareStatus === null && !state.winner) {
          setView(v => v === 'dare' ? 'game' : v);
      }
    };

    const onNewMessage = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    };

    const onNewReaction = (reaction: Reaction) => {
      setReactions(prev => [...prev, reaction]);
    };

    const onError = ({ message }: { message: string }) => {
      setError(message);
    };

    socket.on('room_created', onRoomCreated);
    socket.on('room_joined', onRoomJoined);
    socket.on('player_joined', onPlayerJoined);
    socket.on("game_update", onGameUpdate);
    socket.on('new_message', onNewMessage);
    socket.on('new_reaction', onNewReaction);
    socket.on('error', onError);

    return () => {
      socket.off('room_created', onRoomCreated);
      socket.off('room_joined', onRoomJoined);
      socket.off('player_joined', onPlayerJoined);
      socket.off('game_update', onGameUpdate);
      socket.off('new_message', onNewMessage);
      socket.off('new_reaction', onNewReaction);
      socket.off('error', onError);
    };
  }, []);

  useEffect(() => {
    if (view === 'lobby' && gameState?.tier && opponentJoined) {
      setView('game');
    }
  }, [view, gameState?.tier, opponentJoined]);

  const handleCreateGame = () => {
    socket.emit('create_room');
  };

  const handleJoinGame = (code: string) => {
    socket.emit('join_room', { code });
  };

  const handleSetTier = (tier: Tier) => {
    socket.emit('set_tier', { code: roomCode, tier });
  };

  const handleMakeMove = (index: number) => {
    socket.emit('make_move', { index });
  };

  const handleSendMessage = (text: string) => {
    socket.emit('send_message', { text });
  };

  const handleSendReaction = (emoji: string) => {
    socket.emit('send_reaction', { emoji });
  };

  const handleDareStatusUpdate = (status: DareStatus) => {
    socket.emit('dare_status_update', { status });
  };

  const handleRequestRematch = () => {
    socket.emit('request_rematch');
  };

  const handleReturnHome = () => {
      setView('home');
      setRoomCode('');
      setMySymbol(null);
      setGameState(null);
      setMessages([]);
      setOpponentJoined(false);
  };

  if (view === 'home') {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
        <HomeScreen onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
        {error && <div style={{ color: 'var(--nasty-color)', textAlign: 'center', fontWeight: 'bold', marginTop: '1rem' }}>{error}</div>}
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem', padding: '20px' }}>
        <div className="playfair" style={{ fontSize: 'clamp(36px, 8vw, 56px)', textAlign: 'center' }}>dare tac toe</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 15, textAlign: 'center' }}>pick your heat level before the game begins</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', maxWidth: 520 }}>
          {(['mild', 'spicy', 'nasty'] as Tier[]).map(t => (
            <div key={t}
              onClick={() => t && handleSetTier(t)}
              className={`card ${gameState?.tier === t ? (t === 'mild' ? 'mild-glow' : t === 'spicy' ? 'spicy-glow' : 'nasty-glow') : ''}`}
              style={{
                padding: '24px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: gameState?.tier === t ? `2px solid var(--${t}-color)` : '2px solid #333',
                transform: gameState?.tier === t ? 'translateY(-4px)' : 'none'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{t === 'mild' ? '🟡' : t === 'spicy' ? '🟠' : '🔴'}</div>
              <div className="playfair" style={{ fontSize: 18, fontWeight: 600, textTransform: 'capitalize', marginBottom: 6, color: gameState?.tier === t ? `var(--${t}-color)` : '#aaa' }}>{t}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {t === "mild" && "Truths, confessions, fun"}
                {t === "spicy" && "Flirty, personal, daring"}
                {t === "nasty" && "No limits. You know."}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: 520 }}>
          <p style={{ color: 'var(--text-dim)' }}>Share this code with a friend to start playing!</p>
          <InviteCode code={roomCode} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{
              width: '18px',
              height: '18px',
              border: '2px solid var(--accent-color)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Waiting for opponent...</span>
          </div>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .mild-glow { box-shadow: 0 0 24px rgba(255, 215, 0, 0.2); }
        `}</style>
      </div>
    );
  }

  if (view === 'dare' && gameState) {
      return (
          <div className={gameState.tier === 'nasty' ? 'nasty-grain' : ''}>
              <DareReveal
                gameState={gameState}
                mySymbol={mySymbol!}
                onStatusUpdate={handleDareStatusUpdate}
                onRematch={handleRequestRematch}
                onReturnHome={handleReturnHome}
              />
          </div>
      );
  }

  return (
    <div className={gameState?.tier === 'nasty' ? 'nasty-grain' : ''} style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      gap: '40px',
      padding: '40px 20px',
      flexWrap: 'wrap'
    }}>
      <FloatingReactions
        reactions={reactions}
        onRemove={(id) => setReactions(prev => prev.filter(r => r.id !== id))}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="playfair" style={{ fontSize: 22, fontWeight: 700 }}>dare tac toe</div>
            {gameState?.tier && (
                <div style={{
                    border: `1px solid var(--${gameState.tier}-color)`,
                    borderRadius: 100,
                    padding: '4px 16px',
                    fontSize: 12,
                    color: `var(--${gameState.tier}-color)`
                }}>
                    {gameState.tier === 'mild' ? '🟡' : gameState.tier === 'spicy' ? '🟠' : '🔴'} {gameState.tier}
                </div>
            )}
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 14, color: 'var(--text-dim)', alignItems: 'center' }}>
            <span style={{ color: gameState?.currentTurn === 'X' && !gameState?.winner ? 'var(--nasty-color)' : 'var(--text-muted)', fontWeight: gameState?.currentTurn === 'X' && !gameState?.winner ? 700 : 400 }}>
                X · {gameState?.scores.X} wins {gameState?.scores.Xchicken > 0 ? `| 🐔×${gameState.scores.Xchicken}` : ""}
            </span>
            <span style={{ color: '#333' }}>vs</span>
            <span style={{ color: gameState?.currentTurn === 'O' && !gameState?.winner ? 'var(--mild-color)' : 'var(--text-muted)', fontWeight: gameState?.currentTurn === 'O' && !gameState?.winner ? 700 : 400 }}>
                O · {gameState?.scores.O} wins {gameState?.scores.Ochicken > 0 ? `| 🐔×${gameState.scores.Ochicken}` : ""}
            </span>
        </div>

        <div className="playfair" style={{ fontSize: 18, color: 'var(--text-dim)', height: 28, textAlign: 'center' }}>
            {gameState?.winner === 'draw' && "it's a draw 🤝"}
            {gameState?.winner && gameState.winner !== 'draw' && `player ${gameState.winner} wins 🔥`}
            {!gameState?.winner && `player ${gameState?.currentTurn}'s turn`}
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '12px' }}>
          {gameState && (
            <Board
              board={gameState.board}
              onCellClick={handleMakeMove}
              winningIndices={gameState.winningIndices}
              disabled={!!gameState.winner || gameState.currentTurn !== mySymbol}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
            {["😭","💀","🔥","😏","👀","🫦"].map(emoji => (
                <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    style={{ background: 'none', border: 'none', fontSize: 24, padding: '4px 6px' }}
                >
                    {emoji}
                </button>
            ))}
        </div>

        {gameState?.winner === 'draw' && (
            <button className="primary-button" onClick={handleRequestRematch}>rematch →</button>
        )}
      </div>

      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        mySymbol={mySymbol!}
      />
    </div>
  );
};

export default App;
