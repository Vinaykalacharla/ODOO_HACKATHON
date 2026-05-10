import React from 'react';

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    green: 'bg-teal/10 text-teal border-teal/20',
    amber: 'bg-accent/10 text-accent border-accent/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    red: 'bg-danger/10 text-danger border-danger/20',
    gray: 'bg-muted/10 text-muted border-muted/20'
  };

  const statusMap = {
    planned: 'green',
    completed: 'green',
    draft: 'amber',
    ongoing: 'blue'
  };

  const selectedVariant = statusMap[children?.toLowerCase()] || variant;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${variants[selectedVariant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
