import React from 'react';

const Input = ({ label, helper, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-semibold text-muted ml-1">{label}</label>}
      <input
        className={`px-4 py-2.5 rounded-xl border transition-all duration-300 outline-none
          ${error 
            ? 'border-danger focus:ring-4 focus:ring-danger/10' 
            : 'border-border focus:border-accent focus:ring-4 focus:ring-accent/10'}
          bg-surface text-text placeholder:text-muted/50`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-danger ml-1">{error}</p>}
      {!error && helper && <p className="text-xs text-muted ml-1">{helper}</p>}
    </div>
  );
};

export default Input;
