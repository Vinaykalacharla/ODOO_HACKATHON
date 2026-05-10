import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, MapPinned } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import ActivityCard from '../../components/travel/ActivityCard';
import Badge from '../../components/ui/Badge';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useTravelStore } from '../../store/travelStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { useTripBundle } from '../../hooks/useTripBundle';
import { ACTIVITY_CATEGORY_META } from '../../lib/meta';
import { getOwnedTrips } from '../../lib/selectors';

export default function ActivitySearchPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = useTravelStore((current) => current);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const addTripActivity = useTravelStore((store) => store.addTripActivity);
  const pushToast = useToastStore((store) => store.pushToast);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [maxCost, setMaxCost] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const ownedTrips = useMemo(() => getOwnedTrips(state, currentUser?.id), [state, currentUser?.id]);
  const [selectedTripId, setSelectedTripId] = useState(searchParams.get('tripId') || ownedTrips[0]?.id || '');

  const selectedTripBundle = useTripBundle(selectedTripId);
  const [selectedStopId, setSelectedStopId] = useState(searchParams.get('stopId') || selectedTripBundle?.stops[0]?.id || '');

  useEffect(() => {
    const queryTrip = searchParams.get('tripId');
    if (queryTrip) setSelectedTripId(queryTrip);
  }, [searchParams]);

  useEffect(() => {
    if (selectedTripBundle?.stops?.length && !selectedStopId) {
      setSelectedStopId(selectedTripBundle.stops[0].id);
    }
  }, [selectedTripBundle, selectedStopId]);

  useEffect(() => {
    if (selectedTripBundle?.stops?.length && selectedStopId) {
      const stillValid = selectedTripBundle.stops.some((stop) => stop.id === selectedStopId);
      if (!stillValid) {
        setSelectedStopId(selectedTripBundle.stops[0].id);
      }
    }
  }, [selectedTripBundle, selectedStopId]);

  if (selectedTripBundle?.trip && selectedTripBundle.trip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const city = state.cities.find((candidate) => String(candidate.id) === String(cityId));
  const targetStop = selectedTripBundle?.stops.find((stop) => stop.id === selectedStopId);

  const activities = useMemo(() => {
    if (!city) return [];
    return state.activities
      .filter((activity) => activity.cityId === city.id)
      .filter((activity) => {
        const needle = query.trim().toLowerCase();
        const matchesSearch = !needle || `${activity.name} ${activity.description}`.toLowerCase().includes(needle);
        const matchesCategory = category === 'all' || activity.category === category;
        const matchesCost = !maxCost || Number(activity.estimatedCostUsd) <= Number(maxCost);
        const matchesDuration = !maxDuration || Number(activity.durationHours) <= Number(maxDuration);
        return matchesSearch && matchesCategory && matchesCost && matchesDuration;
      })
      .slice()
      .sort((a, b) => Number(a.estimatedCostUsd) - Number(b.estimatedCostUsd));
  }, [state.activities, city, query, category, maxCost, maxDuration]);

  if (!city) {
    return (
      <EmptyState
        icon={MapPinned}
        title="City not found"
        description="The selected city does not exist in the catalog."
        actionLabel="Back to cities"
        onAction={() => navigate('/cities')}
      />
    );
  }

  const handleAdd = async (activity) => {
    if (!selectedTripId || !selectedStopId || !targetStop) {
      pushToast({ title: 'Pick a trip and stop', description: 'Select where this activity should live.', variant: 'error' });
      return;
    }

    const nextIndex = state.tripActivities.filter((entry) => entry.tripStopId === selectedStopId).length;
    await addTripActivity(selectedStopId, {
      activityId: activity.id,
      scheduledDate: targetStop.arrivalDate,
      scheduledTime: ['09:00', '11:30', '15:00', '19:00'][nextIndex % 4],
    });
    pushToast({ title: 'Activity added', description: `${activity.name} was attached to the stop.`, variant: 'success' });
  };

  const activityTypes = ['all', ...Object.keys(ACTIVITY_CATEGORY_META)];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Activity Search</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">
              {city.flag} {city.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {city.country} · {city.region}
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/cities')}>
            Back to Cities
          </Button>
        </div>
      </section>

      <Card className="grid gap-4 p-5 lg:grid-cols-5">
        <Input label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activities" icon={<Search className="h-4 w-4" />} />
        <Input label="Category" as="select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {activityTypes.map((option) => (
            <option key={option} value={option}>
              {option === 'all' ? 'All categories' : ACTIVITY_CATEGORY_META[option].label}
            </option>
          ))}
        </Input>
        <Input label="Max Cost" type="number" min="0" value={maxCost} onChange={(event) => setMaxCost(event.target.value)} placeholder="100" />
        <Input label="Max Duration" type="number" min="0" value={maxDuration} onChange={(event) => setMaxDuration(event.target.value)} placeholder="4" />
        <Input label="Trip" as="select" value={selectedTripId} onChange={(event) => setSelectedTripId(event.target.value)}>
          {ownedTrips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.title}
            </option>
          ))}
        </Input>
      </Card>

      <Card className="grid gap-4 p-5 lg:grid-cols-2">
        <Input label="Stop" as="select" value={selectedStopId} onChange={(event) => setSelectedStopId(event.target.value)}>
          {selectedTripBundle?.stops.map((stop) => {
            const stopCity = state.cities.find((candidate) => candidate.id === stop.cityId);
            return (
              <option key={stop.id} value={stop.id}>
                {stopCity?.name || 'Stop'} · {stop.arrivalDate}
              </option>
            );
          })}
        </Input>
        <div className="rounded-2xl bg-bg px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Target stop</p>
          <p className="mt-1 text-lg font-semibold text-text">
            {targetStop ? `${targetStop.arrivalDate} → ${targetStop.departureDate}` : 'No stop selected'}
          </p>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onAdd={handleAdd} />
        ))}
      </div>

      {activities.length === 0 ? (
        <EmptyState icon={Search} title="No activities match" description="Loosen the filters and try again." />
      ) : null}
    </div>
  );
}
