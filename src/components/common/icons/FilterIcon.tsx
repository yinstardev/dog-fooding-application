import React from 'react';

export const FilterIcon: React.FC = () => (
  <button
    style={{
      width: '15px',
      height: '15px',
      padding: 0,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    }}
  >
    <svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0 -1028.4)">
        <path d="m10 11v10l4 3v-13h-4z" fill="#bdc3c7" transform="translate(0 1028.4)" />
        <path d="m10 11v10l2 1.5v-11.5h-2z" fill="#95a5a6" transform="translate(0 1028.4)" />
        <path d="m1 1028.4 9 11h4l9-11z" fill="#95a5a6" />
        <path d="m1 1028.4 9 11h2v-11z" fill="#7f8c8d" />
      </g>
    </svg>
  </button>
);
