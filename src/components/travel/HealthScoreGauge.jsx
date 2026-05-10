import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { clamp } from '../../lib/format';

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

export default function HealthScoreGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setAnimatedScore(score));
    return () => window.cancelAnimationFrame(id);
  }, [score]);

  const colorClass = useMemo(() => {
    if (score > 70) return 'text-teal';
    if (score >= 40) return 'text-accent';
    return 'text-danger';
  }, [score]);

  const arc = useMemo(() => describeArc(100, 100, 72, 210, -30), []);
  const strokeDasharray = 2 * Math.PI * 72;
  const progress = clamp(animatedScore, 0, 100) / 100;
  const ringColor = score > 70 ? '#0F766E' : score >= 40 ? '#2563EB' : '#DC2626';

  return (
    <div className="rounded-[2rem] border border-border bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Trip health</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-text">Health Score</h3>
          <p className="mt-2 text-sm leading-6 text-muted">A quick read on budget, stops, activities, and packing progress.</p>
        </div>
        <div className={cn('rounded-2xl px-4 py-3 text-right', score > 70 ? 'bg-teal-50' : score >= 40 ? 'bg-sky-50' : 'bg-rose-50')}>
          <p className={cn('text-3xl font-semibold', colorClass)}>{Math.round(score)}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">Overall</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-56 w-56">
          <path d={arc} fill="none" stroke="rgba(216,224,236,0.95)" strokeWidth="18" strokeLinecap="round" />
          <path
            d={arc}
            fill="none"
            stroke={ringColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDasharray * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
          <text x="100" y="95" textAnchor="middle" className="fill-text text-[26px] font-semibold">
            {Math.round(score)}
          </text>
          <text x="100" y="118" textAnchor="middle" className="fill-muted text-[11px] uppercase tracking-[0.24em]">
            Trip health
          </text>
        </svg>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Budget', value: score > 70 ? 'Healthy' : score >= 40 ? 'Watch' : 'Over' },
          { label: 'Stops', value: 'Tracked' },
          { label: 'Packing', value: 'In progress' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-white px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-text">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
