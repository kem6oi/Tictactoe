import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface InviteCodeProps {
  code: string;
}

const InviteCode: React.FC<InviteCodeProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{ fontFamily: 'Fredoka One', fontSize: '0.9rem' }}>INVITE CODE</span>
      <div
        onClick={handleCopy}
        style={{
          backgroundColor: 'var(--sunshine-yellow)',
          padding: '10px 20px',
          borderRadius: '50px',
          border: '4px solid var(--text-dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontFamily: 'Fredoka One',
          fontSize: '1.5rem',
          boxShadow: '4px 4px 0 var(--text-dark)',
          position: 'relative'
        }}
      >
        {code}
        {copied ? <Check size={20} color="var(--grass-green)" /> : <Copy size={20} />}

        {copied && (
          <div style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--text-dark)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            animation: 'pop 0.3s'
          }}>
            COPIED!
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteCode;
