import React from 'react';

export default function Label({children}) {
  return (
    <span
      style={{
        backgroundColor: 'var(--label-color)',
        color: 'var(--ifm-color-content)',
        padding: '0.2rem 0.5rem',
        margin: '0 0.2rem',
        borderRadius: '3px',
        border: '1px solid #d0d7de',
        whiteSpace: 'nowrap',
      }}>
      {children}
    </span>
  );
}
