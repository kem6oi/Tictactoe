import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Symbol } from '../types';
import { Send, MessageSquare } from 'lucide-react';
import '../styles/chat.css';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  mySymbol: Symbol;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, mySymbol }) => {
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <>
      <button className="chat-toggle secondary-button" onClick={() => setIsOpen(!isOpen)}>
        <MessageSquare size={24} />
      </button>

      <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <div className="messages-list">
          {messages.map((msg, i) => (
            <div key={i} className="message-bubble">
              <div className={`message-sender sender-${msg.sender}`}>
                Player {msg.sender} {msg.sender === mySymbol ? '(You)' : ''}:
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatArea;
