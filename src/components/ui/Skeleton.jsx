import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = "animate-pulse bg-border/50";
  
  const variants = {
    text: "h-4 w-full rounded",
    avatar: "h-12 w-12 rounded-full",
    card: "h-48 w-full rounded-2xl",
    button: "h-10 w-24 rounded-lg"
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || ''} ${className}`} />
  );
};

export default Skeleton;
