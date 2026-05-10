import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default Card;
