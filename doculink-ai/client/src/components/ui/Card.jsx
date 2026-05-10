import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={twMerge(
        'bg-surface/50 backdrop-blur-xl border border-border rounded-3xl p-6 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
