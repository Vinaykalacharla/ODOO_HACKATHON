import React from 'react';

const Button = ({ children, variant = 'primary', loading = false, className = '', as: Component = 'button', ...props }) => {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20',
    secondary: 'bg-white text-text border border-border hover:bg-bg shadow-sm',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-md shadow-danger/20',
    ghost: 'bg-transparent text-text hover:bg-bg',
    teal: 'bg-teal text-white hover:bg-teal/90 shadow-md shadow-teal/20'
  };

  return (
    <Component
      disabled={loading || props.disabled}
      className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </Component>
  );
};

export default Button;
