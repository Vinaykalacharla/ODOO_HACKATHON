import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Filter, FolderOpen } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import TripCard from '../../components/travel/TripCard';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { TRIP_STATUS_META } from '../../lib/meta';

const statusOptions = ['all', ...Object.keys(TRIP_STATUS_META)];

export default function MyTripsPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.users.find((user) => user.id === state.currentUserId));
  const state = useTravelStore((current) => current);
  const deleteTrip = useTravelStore((store) => store.deleteTrip);
  const pushToast = useToastStore((store) => store.pushToast);
  const [status, setStatus] = useState('all');

  const trips = useMemo(
    () =>
      state.trips
        .filter((trip) => trip.userId === currentUser?.id && !trip.deletedAt)
        .filter((trip) => (status === 'all' ? true : trip.status === status))
        .slice()
        .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))),
    [state, currentUser?.id, status],
  );

  const stopMap = useMemo(() => {
    return state.tripStops.reduce((map, stop) => {
      const key = stop.tripId;
      map[key] = map[key] || [];
      map[key].push(stop);
      return map;
    }, {});
  }, [state]);

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm('Delete this trip? It will be archived in the demo store.');
    if (!confirmed) return;
    try {
      await deleteTrip(tripId);
      pushToast({ title: 'Trip deleted', description: 'The trip was soft deleted.', variant: 'success' });
    } catch (error) {
      pushToast({ title: 'Delete failed', description: error.message, variant: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Trips</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">My Trips</h1>
            <p className="mt-1 text-sm text-muted">View, edit, and manage every itinerary in one place.</p>
          </div>
          <Button as={Link} to="/trips/new">
            New Trip
          </Button>
        </div>
      </section>

      <Card className="flex flex-wrap items-center gap-2 p-4">
        <Filter className="h-4 w-4 text-muted" />
        {statusOptions.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${
              status === value ? 'bg-accent text-text' : 'bg-bg text-muted hover:text-text'
            }`}
          >
            {value === 'all' ? 'All Statuses' : TRIP_STATUS_META[value].label}
          </button>
        ))}
      </Card>

      {trips.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => {
            const stops = stopMap[trip.id] || [];
            const cityNames = stops
              .slice()
              .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder))
              .map((stop) => state.cities.find((city) => city.id === stop.cityId)?.name)
              .filter(Boolean);
            return (
              <TripCard
                key={trip.id}
                trip={trip}
                cityNames={cityNames}
                stopCount={stops.length}
                onEdit={`/trips/${trip.id}/edit`}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="No trips match this filter"
          description="Create a new trip or switch to a different status to see more results."
          actionLabel="Create Trip"
          onAction={() => navigate('/trips/new')}
        />
      )}
    </div>
  );
}
