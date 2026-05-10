import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Input({ label, helperText, error, className, id, icon, as = 'input', ...props }) {
  const inputId = id || props.name;
  const Component = as;

  return (
    <label className="block space-y-2.5" htmlFor={inputId}>
      {label ? <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</span> : null}
      <div className="relative">
        {icon ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span> : null}
        <Component
          id={inputId}
          className={cn(
            'focus-ring w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-text shadow-[0_10px_25px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-accent focus:bg-white',
            icon ? 'pl-11' : '',
            as === 'select' ? 'appearance-none pr-10' : '',
            as === 'textarea' ? 'min-h-[120px] resize-y leading-6' : '',
            error ? 'border-danger ring-1 ring-danger/10' : '',
            className,
          )}
          {...props}
        />
        {as === 'select' ? <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /> : null}
      </div>
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </label>
  );
}
