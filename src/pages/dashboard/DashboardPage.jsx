import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarRange, MapPinned, Route, Sparkles, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TripCard from '../../components/travel/TripCard';
import CityCard from '../../components/travel/CityCard';
import EmptyState from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { formatDate } from '../../lib/format';
import { getOwnedTrips, getRecentTrips, getRecommendedCities } from '../../lib/selectors';

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text">{value}</p>
          {detail ? <p className="mt-2 text-sm leading-6 text-muted">{detail}</p> : null}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#1d4ed8]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.users.find((user) => user.id === state.currentUserId));
  const state = useTravelStore((current) => current);

  const ownedTrips = useMemo(() => getOwnedTrips(state, currentUser?.id), [state, currentUser?.id]);
  const recentTrips = useMemo(() => getRecentTrips(state, currentUser?.id, 3), [state, currentUser?.id]);
  const recommendedCities = useMemo(() => getRecommendedCities(state, 6), [state]);

  const upcomingTrips = useMemo(
    () => ownedTrips.filter((trip) => new Date(trip.startDate) >= new Date() && trip.status !== 'completed').length,
    [ownedTrips],
  );

  const cityCount = useMemo(() => {
    const cityIds = new Set();
    state.tripStops
      .filter((stop) => state.trips.some((trip) => trip.id === stop.tripId && trip.userId === currentUser?.id && !trip.deletedAt))
      .forEach((stop) => cityIds.add(stop.cityId));
    return cityIds.size;
  }, [state, currentUser?.id]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Dashboard</p>
            <h1 className="mt-3 text-4xl leading-tight tracking-[-0.05em] text-text lg:text-6xl">
              Welcome back, {currentUser?.name || 'Traveler'}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Keep your next multi-city trip moving with recent plans, recommended destinations, and a single place for every detail.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/trips/new">
              <Sparkles className="h-4 w-4" />
              Plan New Trip
            </Button>
            <Button as={Link} to="/trips" variant="secondary">
              View Trips
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard icon={Route} label="Total trips" value={ownedTrips.length} detail="Trips you can open right now" />
        <StatCard icon={CalendarRange} label="Upcoming trips" value={upcomingTrips} detail="Planned departures ahead" />
        <StatCard icon={MapPinned} label="Cities visited" value={cityCount} detail="Unique cities in your trips" />
        <StatCard
          icon={Sparkles}
          label="Most recent update"
          value={recentTrips[0] ? formatDate(recentTrips[0].updatedAt) : '-'}
          detail="Last trip activity"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text">Recent Trips</h2>
            <p className="mt-1 text-sm text-muted">Your latest itineraries, surfaced first.</p>
          </div>
          <Button as={Link} to="/trips" variant="secondary">
            View all trips
          </Button>
        </div>
        {recentTrips.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {recentTrips.map((trip) => {
              const cityNames = state.tripStops
                .filter((stop) => stop.tripId === trip.id)
                .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder))
                .map((stop) => state.cities.find((city) => city.id === stop.cityId)?.name)
                .filter(Boolean);
              const stopCount = state.tripStops.filter((stop) => stop.tripId === trip.id).length;
              return <TripCard key={trip.id} trip={trip} cityNames={cityNames} stopCount={stopCount} showActions={false} />;
            })}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No trips yet"
            description="Create your first itinerary and Traveloop will build the rest of the workspace around it."
            actionLabel="Plan New Trip"
            onAction={() => navigate('/trips/new')}
          />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text">Discover Cities</h2>
          <p className="mt-1 text-sm text-muted">Popular destinations seeded from the city catalog.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommendedCities.map((city) => (
            <CityCard key={city.id} city={city} onClick={() => navigate('/cities')} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
