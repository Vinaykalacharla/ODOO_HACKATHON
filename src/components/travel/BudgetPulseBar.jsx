import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { clamp, formatCurrency } from '../../lib/format';

export default function BudgetPulseBar({ budget, spent, activityCost, status, label = 'Budget pulse' }) {
  const totalBudget = Number(budget || 0);
  const totalSpent = Number(spent || 0) + Number(activityCost || 0);
  const pct = totalBudget ? clamp((totalSpent / totalBudget) * 100, 0, 140) : 0;
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setAnimatedPct(pct));
    return () => window.cancelAnimationFrame(frame);
  }, [pct]);

  const tone = useMemo(() => {
    if (status === 'over') return 'bg-danger';
    if (status === 'warning') return 'bg-accent';
    return 'bg-teal';
  }, [status]);

  const statusText = status === 'over' ? 'Over budget' : status === 'warning' ? 'Near limit' : 'Healthy';

  return (
    <div className="rounded-[2rem] border border-border bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">{label}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-text">Budget Pulse</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Track the budget cap against the current spend and activity costs.</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Status</p>
          <p className={cn('mt-1 text-sm font-semibold', status === 'over' ? 'text-danger' : status === 'warning' ? 'text-accent' : 'text-teal')}>
            {statusText}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Budget</p>
          <p className="mt-1 text-lg font-semibold text-text">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Spent</p>
          <p className="mt-1 text-lg font-semibold text-text">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Usage</p>
          <p className={cn('mt-1 text-lg font-semibold', status === 'over' ? 'text-danger' : status === 'warning' ? 'text-accent' : 'text-teal')}>
            {Math.round(pct)}%
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-text">{Math.round(animatedPct)}%</span>
          <span className={cn('font-medium', status === 'over' ? 'text-danger' : status === 'warning' ? 'text-accent' : 'text-teal')}>
            {statusText}
          </span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-bg">
          <div
            className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tone)}
            style={{ width: `${clamp(animatedPct, 0, 140)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
