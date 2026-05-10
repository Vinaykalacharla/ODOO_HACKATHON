import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const variants = {
  primary:
    'border border-[#1d4ed8] bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_55%,#1e40af_100%)] text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(37,99,235,0.3)]',
  secondary:
    'border border-border bg-white text-text shadow-[0_10px_25px_rgba(15,23,42,0.05)] hover:border-[#c9d9f0] hover:bg-[#f8fbff]',
  danger:
    'border border-[#ef4444] bg-[#dc2626] text-white shadow-[0_14px_28px_rgba(220,38,38,0.18)] hover:-translate-y-0.5 hover:bg-[#b91c1c]',
  ghost: 'border border-transparent bg-transparent text-text hover:bg-[#eef4ff] hover:text-[#1d4ed8]',
};

export default function Button({
  children,
  className,
  loading = false,
  variant = 'primary',
  type = 'button',
  as: Component = 'button',
  disabled,
  ...props
}) {
  const isButton = Component === 'button';
  const isDisabled = isButton ? loading || disabled : disabled;

  return (
    <Component
      type={isButton ? type : undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={!isButton && isDisabled ? true : undefined}
      className={cn(
        'focus-ring relative inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] || variants.primary,
        className,
      )}
      {...props}
    >
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
      {loading ? <Loader2 className="absolute h-4 w-4 animate-spin" /> : null}
    </Component>
  );
}
