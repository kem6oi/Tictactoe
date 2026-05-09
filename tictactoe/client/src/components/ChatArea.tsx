import React, { useRef, useEffect } from 'react';
import { ChatMessage, Symbol } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  mySymbol: Symbol;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, mySymbol }) => {
  const [inputText, setInputText] = React.useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      flex: '1 1 260px',
      minWidth: 240,
      maxWidth: 320,
      background: 'var(--card-bg)',
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid var(--border-color)'
    }}>
      <div className="playfair" style={{ padding: '16px 20px', fontSize: 16, borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)' }}>
        chat 💬
      </div>
      <div ref={chatRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 260,
        maxHeight: 320
      }}>
        {messages.length === 0 && <div style={{ color: '#444', fontSize: 13, textAlign: 'center', marginTop: 40 }}>say something...</div>}
        {messages.map((m, i) => (
          <div key={i} style={{
            border: '1px solid',
            borderRadius: 14,
            padding: '10px 14px',
            maxWidth: '85%',
            animation: 'slideUp 0.2s ease-out',
            alignSelf: m.sender === 'X' ? 'flex-start' : 'flex-end',
            background: m.sender === 'X' ? 'rgba(232, 160, 191, 0.08)' : 'rgba(255, 215, 0, 0.08)',
            borderColor: m.sender === 'X' ? 'rgba(232, 160, 191, 0.2)' : 'rgba(255, 215, 0, 0.2)',
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 4,
              textTransform: 'uppercase',
              color: m.sender === 'X' ? 'var(--nasty-color)' : 'var(--mild-color)'
            }}>
              Player {m.sender} {m.sender === mySymbol ? '(You)' : ''}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: '#ddd' }}>{m.text}</div>
            <div style={{ fontSize: 10, color: '#555', marginTop: 4, textAlign: 'right' }}>
              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
        <input
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-light)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            padding: '14px 20px'
          }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="type something..."
        />
        <button
            onClick={handleSend}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: 20, padding: '0 16px' }}
        >
            →
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
