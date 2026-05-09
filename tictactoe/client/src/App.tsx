import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import HomeScreen from './components/HomeScreen';
import Board from './components/Board';
import ChatArea from './components/ChatArea';
import InviteCode from './components/InviteCode';
import GameStatus from './components/GameStatus';
import { GameState, ChatMessage, Symbol } from './types';
import { fireConfetti } from './components/ConfettiEffect';
import './styles/global.css';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'lobby' | 'game'>('home');
  const [roomCode, setRoomCode] = useState('');
  const [mySymbol, setMySymbol] = useState<Symbol | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setView('game');
      setOpponentJoined(true);
      setError(null);
    };

    const onPlayerJoined = () => {
      setOpponentJoined(true);
      setView('game');
    };

    const onGameUpdate = (state: GameState) => {
      setGameState(state);
    };

    const onNewMessage = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    };

    const onError = ({ message }: { message: string }) => {
      setError(message);
    };

    socket.on('room_created', onRoomCreated);
    socket.on('room_joined', onRoomJoined);
    socket.on('player_joined', onPlayerJoined);
    socket.on("game_update", onGameUpdate);
    socket.on('new_message', onNewMessage);
    socket.on('error', onError);

    return () => {
      socket.off('room_created', onRoomCreated);
      socket.off('room_joined', onRoomJoined);
      socket.off('player_joined', onPlayerJoined);
      socket.off('game_update', onGameUpdate);
      socket.off('new_message', onNewMessage);
      socket.off('error', onError);
    };
  }, []);

  useEffect(() => {
    if (gameState?.winner && gameState.winner !== 'draw' && gameState.winner === mySymbol) {
      fireConfetti();
    }
  }, [gameState?.winner, mySymbol]);

  const handleCreateGame = () => {
    socket.emit('create_room');
  };

  const handleJoinGame = (code: string) => {
    socket.emit('join_room', { code });
  };

  const handleMakeMove = (index: number) => {
    socket.emit('make_move', { index });
  };

  const handleSendMessage = (text: string) => {
    socket.emit('send_message', { text });
  };

  const handleRequestRematch = () => {
    socket.emit('request_rematch');
  };

  if (view === 'home') {
    return (
      <>
        <HomeScreen onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
        {error && <div style={{ color: 'var(--tomato-red)', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
      </>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="home-container">
        <h1 className="title">LOBBY</h1>
        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <p>Share this code with a friend to start playing!</p>
          <InviteCode code={roomCode} />
          <div className="flex-center" style={{ gap: '10px' }}>
            <div className="spinner" style={{
              width: '20px',
              height: '20px',
              border: '3px solid var(--sunshine-yellow)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Waiting for opponent...</span>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      gap: '40px',
      padding: '20px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <InviteCode code={roomCode} />

        <div className="card" style={{ textAlign: 'center' }}>
          {gameState && (
            <GameStatus
              winner={gameState.winner}
              currentTurn={gameState.currentTurn}
              mySymbol={mySymbol!}
            />
          )}

          {gameState && (
            <Board
              board={gameState.board}
              onCellClick={handleMakeMove}
              winningIndices={gameState.winningIndices}
              disabled={!!gameState.winner || gameState.currentTurn !== mySymbol}
            />
          )}

          {gameState?.winner && (
            <button
              className="primary-button"
              onClick={handleRequestRematch}
              style={{ marginTop: '20px' }}
            >
              REMATCH?
            </button>
          )}
        </div>
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
