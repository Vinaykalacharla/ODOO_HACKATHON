import { cn } from '../../lib/cn';

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
