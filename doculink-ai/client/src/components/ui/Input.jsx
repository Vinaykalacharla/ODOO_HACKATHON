import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-muted ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          className={twMerge(
            'w-full bg-surface/50 border border-border rounded-xl py-3 outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10',
            Icon ? 'pl-12 pr-4' : 'px-4',
            error ? 'border-danger focus:ring-danger/10' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-danger ml-1 font-medium">{error}</span>}
    </div>
  );
};

export default Input;
