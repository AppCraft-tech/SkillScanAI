import React from 'react';

const TieLogo = ({ className = "w-10 h-10 text-blue-600" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 2.5L14 2.5L13.5 5.5H10.5L10 2.5Z" />
    <path d="M10.5 7H13.5L15 17L12 21L9 17L10.5 7Z" />
  </svg>
);

export default TieLogo;
