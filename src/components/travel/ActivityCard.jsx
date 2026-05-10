import { Clock3, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ACTIVITY_CATEGORY_META } from '../../lib/meta';
import { formatCurrency } from '../../lib/format';

export default function ActivityCard({ activity, onAdd, compact = false }) {
  const meta = ACTIVITY_CATEGORY_META[activity.category] || ACTIVITY_CATEGORY_META.sightseeing;

  return (
    <Card className={compact ? 'p-4' : 'p-5'}>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-text">{activity.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{activity.description}</p>
          </div>
          <Badge tone="blue">{meta.label}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f8fbff] px-3 py-1.5 font-medium text-text">
            {formatCurrency(activity.estimatedCostUsd)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
            <Clock3 className="h-4 w-4" />
            {activity.durationHours} hrs
          </span>
        </div>

        {onAdd ? (
          <div className="mt-5">
            <Button className="w-full" onClick={() => onAdd(activity)}>
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
