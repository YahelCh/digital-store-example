import React from 'react';

export default function Fallback() {
  return (
    <div style={{
      height: 120,
      background: '#f0f0f0',
      borderRadius: 8,
      animation: 'pulse 1.5s infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span style={{ color: '#999' }}>Loading...</span>
    </div>
  );
}
