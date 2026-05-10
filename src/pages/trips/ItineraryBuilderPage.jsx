import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GripVertical, Search, Wand2, Plus, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import TripSubnav from '../../components/travel/TripSubnav';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import ActivityCard from '../../components/travel/ActivityCard';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { useTripBundle } from '../../hooks/useTripBundle';
import { addDaysIso, formatDateRange } from '../../lib/format';
import { validateStop } from '../../lib/validators';
import { getCityById } from '../../lib/selectors';

const activityTimeSlots = ['09:00', '11:30', '15:00', '19:00'];

function defaultStopDates(trip) {
  return {
    arrivalDate: trip?.startDate || new Date().toISOString().slice(0, 10),
    departureDate: addDaysIso(trip?.startDate || new Date(), 2),
  };
}

export default function ItineraryBuilderPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const bundle = useTripBundle(tripId);
  const state = useTravelStore((current) => current);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const addStop = useTravelStore((store) => store.addStop);
  const addTripActivity = useTravelStore((store) => store.addTripActivity);
  const deleteStop = useTravelStore((store) => store.deleteStop);
  const reorderStops = useTravelStore((store) => store.reorderStops);
  const pushToast = useToastStore((store) => store.pushToast);

  const [draftStops, setDraftStops] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [cityQuery, setCityQuery] = useState('');
  const [activityQuery, setActivityQuery] = useState('');
  const [addStopForm, setAddStopForm] = useState({ cityId: '', arrivalDate: '', departureDate: '', notes: '' });
  const [addStopErrors, setAddStopErrors] = useState({});

  useEffect(() => {
    if (bundle) {
      setDraftStops(bundle.stops);
    }
  }, [bundle]);

  useEffect(() => {
    if (bundle?.trip) {
      setAddStopForm({
        cityId: '',
        ...defaultStopDates(bundle.trip),
        notes: '',
      });
    }
  }, [bundle?.trip]);

  const cityResults = useMemo(() => {
    return state.cities
      .filter((city) => {
        const needle = cityQuery.trim().toLowerCase();
        return !needle || `${city.name} ${city.country} ${city.region}`.toLowerCase().includes(needle);
      })
      .slice()
      .sort((a, b) => Number(b.popularityScore) - Number(a.popularityScore));
  }, [state.cities, cityQuery]);

  const activities = useMemo(() => {
    if (!selectedStop) return [];
    return state.activities
      .filter((activity) => activity.cityId === selectedStop.cityId)
      .filter((activity) => {
        const needle = activityQuery.trim().toLowerCase();
        return !needle || `${activity.name} ${activity.category} ${activity.description}`.toLowerCase().includes(needle);
      })
      .slice()
      .sort((a, b) => Number(a.estimatedCostUsd) - Number(b.estimatedCostUsd));
  }, [state.activities, selectedStop, activityQuery]);

  if (!bundle) {
    return (
      <EmptyState
        icon={Wand2}
        title="Trip not found"
        description="Open an existing trip before editing the stop order."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (bundle.trip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const openAddActivity = (stop) => {
    setSelectedStop(stop);
    setActivityQuery('');
    setIsActivityOpen(true);
  };

  const handleDragStart = (stopId) => setDragId(stopId);

  const handleDrop = async (targetStopId) => {
    if (!dragId || dragId === targetStopId) return;
    const nextStops = [...draftStops];
    const fromIndex = nextStops.findIndex((stop) => stop.id === dragId);
    const toIndex = nextStops.findIndex((stop) => stop.id === targetStopId);
    const [moved] = nextStops.splice(fromIndex, 1);
    nextStops.splice(toIndex, 0, moved);
    const reordered = nextStops.map((stop, index) => ({ ...stop, stopOrder: index + 1 }));
    setDraftStops(reordered);
    await reorderStops(
      tripId,
      reordered.map((stop) => ({ id: stop.id, stop_order: stop.stopOrder })),
    );
    pushToast({ title: 'Stops reordered', description: 'Your itinerary order was updated.', variant: 'success' });
    setDragId(null);
  };

  const submitAddStop = async () => {
    const nextErrors = validateStop(addStopForm);
    setAddStopErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const created = await addStop(tripId, addStopForm);
    pushToast({ title: 'Stop added', description: 'City stop added to the trip.', variant: 'success' });
    setIsAddStopOpen(false);
    setDraftStops((current) => [...current, created]);
  };

  const handleAddActivity = async (activity) => {
    if (!selectedStop) return;
    const activityIndex = state.tripActivities.filter((entry) => entry.tripStopId === selectedStop.id).length;
    await addTripActivity(selectedStop.id, {
      activityId: activity.id,
      scheduledDate: selectedStop.arrivalDate,
      scheduledTime: activityTimeSlots[activityIndex % activityTimeSlots.length],
    });
    pushToast({ title: 'Activity added', description: 'The selected activity is now on the itinerary.', variant: 'success' });
    setIsActivityOpen(false);
  };

  const selectedCity = getCityById(state.cities, Number(addStopForm.cityId));

  return (
    <div className="space-y-6">
      <TripSubnav basePath={`/trips/${tripId}`} />

      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Itinerary Builder</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">{bundle.trip.title}</h1>
            <p className="mt-1 text-sm text-muted">{formatDateRange(bundle.trip.startDate, bundle.trip.endDate)}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsAddStopOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Stop
            </Button>
            <Button as={Link} to={`/cities?tripId=${tripId}`} variant="secondary">
              Search Cities
            </Button>
          </div>
        </div>
      </section>

      {draftStops.length > 0 ? (
        <div className="space-y-4">
          {draftStops
            .slice()
            .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder))
            .map((stop) => {
              const city = state.cities.find((cityItem) => cityItem.id === stop.cityId);
              const count = state.tripActivities.filter((entry) => entry.tripStopId === stop.id).length;
              return (
                <Card
                  key={stop.id}
                  draggable
                  onDragStart={() => handleDragStart(stop.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(stop.id)}
                  className="cursor-grab p-5 active:cursor-grabbing"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#1d4ed8]">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-2xl">{city?.flag || '🌍'}</span>
                          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text">{city?.name || 'Unknown city'}</h3>
                          <Badge tone="blue">Stop {stop.stopOrder}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted">{formatDateRange(stop.arrivalDate, stop.departureDate)}</p>
                        {stop.notes ? <p className="mt-2 max-w-2xl text-sm text-muted">{stop.notes}</p> : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone="blue">{count} activities</Badge>
                      <Button variant="secondary" onClick={() => openAddActivity(stop)}>
                        Activities
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-danger"
                        onClick={async () => {
                          const confirmed = window.confirm('Delete this stop and its activities?');
                          if (!confirmed) return;
                          await deleteStop(stop.id);
                          setDraftStops((current) => current.filter((entry) => entry.id !== stop.id));
                          pushToast({ title: 'Stop deleted', description: 'The stop was removed from the itinerary.', variant: 'success' });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      ) : (
        <EmptyState
          icon={Wand2}
          title="No stops yet"
          description="Add a city stop to begin building the itinerary."
          actionLabel="Add Stop"
          onAction={() => setIsAddStopOpen(true)}
        />
      )}

      <Modal
        open={isAddStopOpen}
        title="Add City Stop"
        description="Search the city catalog, set dates, and attach the stop to this trip."
        onClose={() => setIsAddStopOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Search City"
            value={cityQuery}
            onChange={(event) => setCityQuery(event.target.value)}
            placeholder="Search cities"
            icon={<Search className="h-4 w-4" />}
          />

          <div className="grid max-h-56 gap-3 overflow-y-auto rounded-2xl border border-border bg-bg/40 p-3">
            {cityResults.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  setAddStopForm((state) => ({
                    ...state,
                    cityId: String(city.id),
                    arrivalDate: state.arrivalDate || defaultStopDates(bundle.trip).arrivalDate,
                    departureDate: state.departureDate || defaultStopDates(bundle.trip).departureDate,
                  }));
                }}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  String(addStopForm.cityId) === String(city.id) ? 'border-accent bg-white' : 'border-border bg-white/80'
                }`}
              >
                <div>
                  <p className="text-base font-semibold text-text">
                    {city.flag} {city.name}
                  </p>
                  <p className="text-sm text-muted">{city.country}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">{city.region}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Arrival Date"
              type="date"
              value={addStopForm.arrivalDate}
              onChange={(event) => setAddStopForm((state) => ({ ...state, arrivalDate: event.target.value }))}
              error={addStopErrors.arrivalDate}
            />
            <Input
              label="Departure Date"
              type="date"
              value={addStopForm.departureDate}
              onChange={(event) => setAddStopForm((state) => ({ ...state, departureDate: event.target.value }))}
              error={addStopErrors.departureDate}
            />
          </div>

          <Input
            label="Notes"
            as="textarea"
            rows={3}
            value={addStopForm.notes}
            onChange={(event) => setAddStopForm((state) => ({ ...state, notes: event.target.value }))}
            placeholder="Optional stop notes"
          />

          {selectedCity ? (
            <p className="text-sm text-muted">
              Selected: {selectedCity.flag} {selectedCity.name}
            </p>
          ) : null}

          <div className="flex gap-3 pt-2">
            <Button onClick={submitAddStop} className="flex-1">
              Save Stop
            </Button>
            <Button variant="secondary" onClick={() => setIsAddStopOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isActivityOpen}
        title={selectedStop ? `Add Activities · ${state.cities.find((city) => city.id === selectedStop.cityId)?.name}` : 'Add Activities'}
        description="Search the matching city activity catalog and add items to the stop."
        onClose={() => setIsActivityOpen(false)}
      >
        {selectedStop ? (
          <div className="space-y-4">
            <Input
              label="Search Activities"
              value={activityQuery}
              onChange={(event) => setActivityQuery(event.target.value)}
              placeholder="Search by name or category"
              icon={<Search className="h-4 w-4" />}
            />
            <div className="grid gap-4">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} onAdd={handleAddActivity} compact />
              ))}
            </div>

            {activities.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No activities found"
                description="Try a broader search term or a different category."
              />
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
