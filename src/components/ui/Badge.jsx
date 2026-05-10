import { cn } from '../../lib/cn';

const toneMap = {
  green: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border border-amber-200 bg-amber-50 text-amber-700',
  blue: 'border border-sky-200 bg-sky-50 text-sky-700',
  teal: 'border border-teal-200 bg-teal-50 text-teal-700',
  violet: 'border border-violet-200 bg-violet-50 text-violet-700',
  gray: 'border border-slate-200 bg-slate-50 text-slate-600',
  red: 'border border-rose-200 bg-rose-50 text-rose-700',
};

export default function Badge({ children, tone = 'gray', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] leading-none',
        toneMap[tone] || toneMap.gray,
        className,
      )}
    >
      {children}
    </span>
  );
}
