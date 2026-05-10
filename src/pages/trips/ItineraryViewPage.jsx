import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, List, PanelsTopLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import TripSubnav from '../../components/travel/TripSubnav';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useAuthStore } from '../../store/authStore';
import { useTripBundle } from '../../hooks/useTripBundle';
import { formatCurrency, formatDateRange } from '../../lib/format';
import { ACTIVITY_CATEGORY_META } from '../../lib/meta';

export default function ItineraryViewPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const bundle = useTripBundle(tripId);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const [mode, setMode] = useState('list');
  const [openStops, setOpenStops] = useState([]);

  const groupedStops = useMemo(() => bundle?.groupedStops || [], [bundle]);

  if (!bundle) {
    return (
      <EmptyState
        icon={List}
        title="Trip not found"
        description="Open a valid trip to preview the itinerary."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (bundle.trip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  return (
    <div className="space-y-6">
      <TripSubnav basePath={`/trips/${tripId}`} />

      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Itinerary View</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">{bundle.trip.title}</h1>
            <p className="mt-1 text-sm text-muted">{formatDateRange(bundle.trip.startDate, bundle.trip.endDate)}</p>
          </div>
          <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <button
              type="button"
              onClick={() => setMode('list')}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'list' ? 'bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] text-white shadow-[0_12px_25px_rgba(37,99,235,0.22)]' : 'text-muted hover:bg-[#eef4ff] hover:text-[#1d4ed8]'}`}
            >
              <List className="mr-2 inline h-4 w-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => setMode('timeline')}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'timeline' ? 'bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] text-white shadow-[0_12px_25px_rgba(37,99,235,0.22)]' : 'text-muted hover:bg-[#eef4ff] hover:text-[#1d4ed8]'}`}
            >
              <PanelsTopLeft className="mr-2 inline h-4 w-4" />
              Timeline
            </button>
          </div>
        </div>
      </section>

      {mode === 'list' ? (
        <div className="space-y-4">
          {groupedStops.map((stop) => {
            const isOpen = openStops.includes(stop.id) || openStops.length === 0;
            return (
              <Card key={stop.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenStops((state) =>
                      state.includes(stop.id) ? state.filter((id) => id !== stop.id) : [...state, stop.id],
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stop.city?.flag || '🌍'}</span>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text">{stop.city?.name || 'Unknown city'}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted">{formatDateRange(stop.arrivalDate, stop.departureDate)}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen ? (
                  <div className="border-t border-border px-5 py-5">
                    {stop.activities.length > 0 ? (
                      <div className="space-y-3">
                        {stop.activities.map((row) => {
                          const meta = ACTIVITY_CATEGORY_META[row.activity?.category] || ACTIVITY_CATEGORY_META.sightseeing;
                          const cost = row.activity ? Number(row.actualCostOverride ?? row.activity.estimatedCostUsd ?? 0) : 0;
                          return (
                            <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-bg px-4 py-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge tone="blue">{row.scheduledTime || 'TBD'}</Badge>
                                  <h4 className="text-lg font-semibold text-text">{row.activity?.name || 'Activity'}</h4>
                                </div>
                                <p className="mt-1 text-sm text-muted">{meta.label}</p>
                              </div>
                              <span className="text-sm font-semibold text-text">{formatCurrency(cost)}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        icon={List}
                        title="No activities yet"
                        description="Use the builder to attach activities to this stop."
                      />
                    )}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-max grid-flow-col gap-4">
            {groupedStops.map((stop) => (
              <Card key={stop.id} className="w-[320px] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stop.city?.flag || '🌍'}</span>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text">{stop.city?.name || 'Unknown city'}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted">{formatDateRange(stop.arrivalDate, stop.departureDate)}</p>
                  </div>
                  <Badge tone="blue">{stop.activities.length}</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {stop.activities.length > 0 ? (
                    stop.activities.map((row) => (
                      <div key={row.id} className="rounded-2xl border border-border bg-bg px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{row.scheduledTime || 'TBD'}</p>
                        <p className="mt-1 text-base font-semibold text-text">{row.activity?.name || 'Activity'}</p>
                        <p className="mt-1 text-sm text-muted">
                          {formatCurrency(Number(row.actualCostOverride ?? row.activity?.estimatedCostUsd ?? 0))}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No activities scheduled yet.</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
