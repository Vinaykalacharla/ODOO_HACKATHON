import { CalendarDays, MapPinned, Route, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDateRange } from '../../lib/format';
import { TRIP_STATUS_META } from '../../lib/meta';

export default function TripCard({
  trip,
  cityNames = [],
  stopCount = 0,
  onDelete,
  onEdit,
  showActions = true,
}) {
  const status = TRIP_STATUS_META[trip.status] || TRIP_STATUS_META.draft;
  const previewCities = cityNames.slice(0, 3);
  const extraCities = Math.max(0, cityNames.length - previewCities.length);

  return (
    <Card className="group overflow-hidden">
      <div className="relative h-52 overflow-hidden bg-[linear-gradient(135deg,rgba(37,99,235,0.15),rgba(15,118,110,0.12))]">
        {trip.coverImageUrl ? (
          <img
            src={trip.coverImageUrl}
            alt={trip.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/18 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge tone={trip.status === 'draft' ? 'amber' : trip.status === 'ongoing' ? 'blue' : 'green'} className="bg-white/90 backdrop-blur">
            {status.label}
          </Badge>
          {trip.isPublic ? (
            <Badge tone="blue" className="bg-white/90 backdrop-blur">
              Public
            </Badge>
          ) : (
            <Badge tone="gray" className="bg-white/90 backdrop-blur">
              Private
            </Badge>
          )}
        </div>

        <div className="absolute right-4 top-4 rounded-2xl border border-white/[0.12] bg-white/[0.16] px-3 py-2 text-right text-white backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/[0.65]">Stops</p>
          <p className="text-lg font-semibold">{stopCount}</p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
          <div className="max-w-[72%]">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/[0.65]">Trip window</p>
            <p className="mt-1 text-sm text-white/[0.85]">{formatDateRange(trip.startDate, trip.endDate)}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.14] px-3 py-2 text-right backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Route</p>
            <p className="text-sm font-semibold text-white">{cityNames.length || 0} cities</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-2">
            <Badge tone={trip.status === 'draft' ? 'amber' : trip.status === 'ongoing' ? 'blue' : 'green'}>
              {status.label}
            </Badge>
            {trip.isPublic ? <Badge tone="blue">Public</Badge> : <Badge tone="gray">Private</Badge>}
          </div>
          <div className="shrink-0 rounded-2xl bg-bg px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Updated</p>
            <p className="text-sm font-semibold text-text">{formatDateRange(trip.startDate, trip.endDate)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-[1.55rem] font-semibold leading-tight tracking-[-0.04em] text-text">{trip.title}</h3>
          <p className="text-sm leading-6 text-muted">{trip.description || 'Plan every city, stop, and activity in one place.'}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-1.5 text-sm font-medium text-[#1d4ed8]">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate">{formatDateRange(trip.startDate, trip.endDate)}</span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-[#effdfb] px-3 py-1.5 text-sm font-medium text-[#0f766e]">
            <MapPinned className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {previewCities.length > 0 ? previewCities.join(' -> ') : 'No stops yet'}
              {extraCities > 0 ? ` +${extraCities}` : ''}
            </span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 sm:col-span-2">
            <Route className="h-4 w-4 shrink-0" />
            {trip.isPublic ? 'Share link ready' : 'Private trip'}
          </span>
        </div>

        {showActions ? (
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to={`/trips/${trip.id}`} variant="secondary">
              View Trip
            </Button>
            {onEdit ? (
              <Button as={Link} to={typeof onEdit === 'string' ? onEdit : `/trips/${trip.id}/edit`} variant="secondary">
                Edit
              </Button>
            ) : null}
            {onDelete ? (
              <Button variant="ghost" className="text-danger" onClick={() => onDelete(trip.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
