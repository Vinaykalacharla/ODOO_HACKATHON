import { MapPinned, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency } from '../../lib/format';

export default function CityCard({ city, onClick, onAdd, compact = false }) {
  const wrapperClass = compact ? 'p-4' : 'p-5';

  return (
    <Card className="group overflow-hidden">
      <div className={`bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(15,118,110,0.12))] ${wrapperClass}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-text shadow-sm backdrop-blur">
              <span className="text-lg">{city.flag}</span>
              <span>{city.country}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-text">{city.name}</h3>
            <p className="mt-1 text-sm text-muted">{city.region || 'Popular destination'}</p>
          </div>
          <div className="rounded-2xl border border-white/50 bg-white/80 px-3 py-2 text-right shadow-sm backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Avg/day</p>
            <p className="mt-1 text-lg font-semibold text-text">{formatCurrency(city.avgDailyCostUsd)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 font-medium text-muted backdrop-blur">
            <MapPinned className="h-4 w-4 text-[#1d4ed8]" />
            Popularity {city.popularityScore}/10
          </span>
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index}>{index < Math.ceil(city.popularityScore / 2) ? '★' : '☆'}</span>
            ))}
          </div>
        </div>
      </div>

      {onAdd || onClick ? (
        <div className="flex gap-3 p-5 pt-0">
          {onClick ? (
            <Button variant="secondary" className="flex-1" onClick={() => onClick(city)}>
              View City
            </Button>
          ) : null}
          {onAdd ? (
            <Button className="flex-1" onClick={() => onAdd(city)}>
              <Plus className="h-4 w-4" />
              Add Stop
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
