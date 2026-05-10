import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', loading = false, className = '', as: Component = 'button', ...props }) => {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20',
    secondary: 'bg-surface text-text border border-border hover:bg-border/50',
    ghost: 'bg-transparent text-muted hover:text-text hover:bg-surface',
    danger: 'bg-danger text-white hover:bg-danger/90',
  };

  return (
    <Component
      disabled={loading || props.disabled}
      className={twMerge(
        'relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </Component>
  );
};

export default Button;
