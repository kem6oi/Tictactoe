import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface InviteCodeProps {
  code: string;
}

const InviteCode: React.FC<InviteCodeProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.8rem'
    }}>
      <span style={{ fontSize: '0.8rem', letterSpacing: 2, color: 'var(--text-muted)' }}>SHARE LINK</span>
      <div
        onClick={handleCopy}
        style={{
          backgroundColor: 'var(--card-bg)',
          padding: '10px 24px',
          borderRadius: '50px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.2rem',
          color: 'var(--text-light)',
          position: 'relative'
        }}
        id="invite-code-container"
      >
        <span id="room-code-text">{code}</span>
        {copied ? <Check size={18} color="var(--mild-color)" /> : <Copy size={18} color="var(--text-muted)" />}

        {copied && (
          <div style={{
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '10px',
            animation: 'popIn 0.3s'
          }}>
            COPIED!
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteCode;
