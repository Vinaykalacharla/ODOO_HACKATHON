import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, MapPinned } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { usePublicTripBundle } from '../../hooks/useTripBundle';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { formatCurrency, formatDateRange } from '../../lib/format';
import { getUserById } from '../../lib/selectors';
import { TRIP_STATUS_META } from '../../lib/meta';

export default function PublicItineraryPage() {
  const { token } = useParams();
  const bundle = usePublicTripBundle(token);
  const pushToast = useToastStore((store) => store.pushToast);
  const users = useAuthStore((store) => store.users);

  const owner = useMemo(() => (bundle ? getUserById(users, bundle.trip.userId) : null), [bundle, users]);

  const copyTrip = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);
    pushToast({ title: 'Copied', description: 'Share link copied to clipboard.', variant: 'success' });
  };

  if (!bundle) {
    return (
      <div className="min-h-screen bg-bg px-4 py-8">
        <EmptyState
          icon={MapPinned}
          title="Shared trip not found"
          description="The share token is invalid or the trip is no longer public."
        />
      </div>
    );
  }

  const { trip, groupedStops, finances } = bundle;
  const statusMeta = TRIP_STATUS_META[trip.status] || TRIP_STATUS_META.draft;

  return (
    <div className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="overflow-hidden">
          <div className="relative min-h-[280px] bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(15,118,110,0.16))]">
            {trip.coverImageUrl ? <img src={trip.coverImageUrl} alt={trip.title} className="h-full w-full object-cover opacity-85" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/16 to-transparent" />
            <div className="absolute left-0 top-0 flex h-full w-full flex-col justify-between p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl text-white">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/[0.72]">Shared by {owner?.name || 'Anonymous'}</p>
                  <h1 className="mt-3 text-5xl leading-[0.94] tracking-[-0.05em] lg:text-7xl">{trip.title}</h1>
                  <p className="mt-3 text-sm text-white/[0.85]">{formatDateRange(trip.startDate, trip.endDate)}</p>
                </div>
                <Button variant="secondary" onClick={copyTrip}>
                  <Copy className="h-4 w-4" />
                  Copy This Trip
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="gray" className="bg-white/90 text-text">
                  {statusMeta.label}
                </Badge>
                <Badge tone="blue" className="bg-white/90 text-text">
                  {groupedStops.length} stops
                </Badge>
                <Badge tone="teal" className="bg-white/90 text-text">
                  {trip.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
          <div className="space-y-4">
            {groupedStops.map((stop) => (
              <Card key={stop.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stop.city?.flag || '🌍'}</span>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-text">{stop.city?.name || 'Unknown city'}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted">{formatDateRange(stop.arrivalDate, stop.departureDate)}</p>
                  </div>
                  <Badge tone="blue">{stop.activities.length} activities</Badge>
                </div>
                <div className="mt-4 grid gap-3">
                  {stop.activities.map((row) => (
                    <div key={row.id} className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {row.scheduledTime || 'TBD'} - {row.activity?.name || 'Activity'}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{row.activity?.category || 'activity'}</p>
                      </div>
                      <span className="text-sm font-semibold text-text">
                        {formatCurrency(Number(row.actualCostOverride ?? row.activity?.estimatedCostUsd ?? 0))}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text">Budget Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-bg px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Budget</p>
                <p className="mt-1 text-xl font-semibold text-text">{formatCurrency(trip.totalBudget)}</p>
              </div>
              <div className="rounded-2xl bg-bg px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Spent</p>
                <p className="mt-1 text-xl font-semibold text-text">{formatCurrency(finances.totalSpent)}</p>
              </div>
              <div className="rounded-2xl bg-bg px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Activity cost</p>
                <p className="mt-1 text-xl font-semibold text-text">{formatCurrency(finances.activityCost)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
