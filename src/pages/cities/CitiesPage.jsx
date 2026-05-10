import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPinned, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import CityCard from '../../components/travel/CityCard';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { addDaysIso } from '../../lib/format';
import { getOwnedTrips } from '../../lib/selectors';

export default function CitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useTravelStore((current) => current);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const addStop = useTravelStore((store) => store.addStop);
  const pushToast = useToastStore((store) => store.pushToast);

  const ownedTrips = useMemo(() => getOwnedTrips(state, currentUser?.id), [state, currentUser?.id]);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [country, setCountry] = useState('all');
  const [selectedTripId, setSelectedTripId] = useState(searchParams.get('tripId') || ownedTrips[0]?.id || '');
  const selectedTrip = useMemo(
    () => state.trips.find((trip) => trip.id === selectedTripId && !trip.deletedAt) || null,
    [state.trips, selectedTripId],
  );

  useEffect(() => {
    const queryTripId = searchParams.get('tripId');
    if (queryTripId) setSelectedTripId(queryTripId);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedTripId && ownedTrips[0]) {
      setSelectedTripId(ownedTrips[0].id);
    }
  }, [ownedTrips, selectedTripId]);

  if (selectedTrip && selectedTrip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const availableCities = useMemo(() => {
    return state.cities
      .filter((city) => {
        const needle = query.trim().toLowerCase();
        const matchesSearch = !needle || `${city.name} ${city.country} ${city.region}`.toLowerCase().includes(needle);
        const matchesRegion = region === 'all' || city.region === region;
        const matchesCountry = country === 'all' || city.country === country;
        return matchesSearch && matchesRegion && matchesCountry;
      })
      .slice()
      .sort((a, b) => Number(b.popularityScore) - Number(a.popularityScore));
  }, [state.cities, query, region, country]);

  const regionOptions = useMemo(() => ['all', ...new Set(state.cities.map((city) => city.region))], [state.cities]);
  const countryOptions = useMemo(() => ['all', ...new Set(state.cities.map((city) => city.country))], [state.cities]);

  const handleAddCity = async (city) => {
    if (!selectedTripId) {
      pushToast({ title: 'Pick a trip first', description: 'Select the itinerary that should receive this stop.', variant: 'error' });
      return;
    }
    const tripStops = state.tripStops.filter((stop) => stop.tripId === selectedTripId).sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder));
    const lastStop = tripStops[tripStops.length - 1];
    const arrivalDate = lastStop ? addDaysIso(lastStop.departureDate, 1) : state.trips.find((trip) => trip.id === selectedTripId)?.startDate || new Date().toISOString().slice(0, 10);
    const departureDate = addDaysIso(arrivalDate, 2);
    await addStop(selectedTripId, { cityId: city.id, arrivalDate, departureDate, notes: '' });
    pushToast({ title: 'City added', description: `${city.name} was added to your trip.`, variant: 'success' });
  };

  if (ownedTrips.length === 0) {
    return (
      <EmptyState
        icon={MapPinned}
        title="Create a trip first"
        description="City search works best after you have a trip to attach stops to."
        actionLabel="Create Trip"
        onAction={() => navigate('/trips/new')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">City Search</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">Search cities in the catalog</h1>
            <p className="mt-1 text-sm text-muted">Click add to place the city into the selected trip.</p>
          </div>
          <Button onClick={() => navigate(`/trips/${selectedTripId}/builder`)} variant="secondary">
            Go to Builder
          </Button>
        </div>
      </section>

      <Card className="grid gap-4 p-5 lg:grid-cols-4">
        <Input
          label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search city, country, or region"
          icon={<Search className="h-4 w-4" />}
        />
        <Input label="Region" as="select" value={region} onChange={(event) => setRegion(event.target.value)}>
          {regionOptions.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'All regions' : item}
            </option>
          ))}
        </Input>
        <Input label="Country" as="select" value={country} onChange={(event) => setCountry(event.target.value)}>
          {countryOptions.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'All countries' : item}
            </option>
          ))}
        </Input>
        <Input label="Trip" as="select" value={selectedTripId} onChange={(event) => setSelectedTripId(event.target.value)}>
          {ownedTrips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.title}
            </option>
          ))}
        </Input>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {availableCities.map((city) => (
          <CityCard key={city.id} city={city} onAdd={handleAddCity} />
        ))}
      </div>

      {availableCities.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No cities found"
          description="Try adjusting the search term or filters."
        />
      ) : null}
    </div>
  );
}
