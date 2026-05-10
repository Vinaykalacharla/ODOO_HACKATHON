import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CalendarDays, FileText, Image, Wallet } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { validateTrip } from '../../lib/validators';
import { TRIP_STATUS_META } from '../../lib/meta';

const initialForm = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  totalBudget: '',
  coverImageUrl: '',
  status: 'draft',
};

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const currentUser = useAuthStore((state) => state.users.find((user) => user.id === state.currentUserId));
  const state = useTravelStore((current) => current);
  const createTrip = useTravelStore((store) => store.createTrip);
  const updateTrip = useTravelStore((store) => store.updateTrip);
  const pushToast = useToastStore((store) => store.pushToast);

  const existingTrip = useMemo(() => state.trips.find((trip) => trip.id === tripId && !trip.deletedAt), [state, tripId]);

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingTrip) {
      setForm({
        title: existingTrip.title,
        description: existingTrip.description || '',
        startDate: existingTrip.startDate,
        endDate: existingTrip.endDate,
        totalBudget: String(existingTrip.totalBudget ?? ''),
        coverImageUrl: existingTrip.coverImageUrl || '',
        status: existingTrip.status || 'draft',
      });
    }
  }, [existingTrip]);

  const mode = existingTrip ? 'edit' : 'create';

  const validate = (nextForm = form) => validateTrip(nextForm);

  const handleBlur = (field) => {
    setTouched((state) => ({ ...state, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setTouched({ title: true, description: true, startDate: true, endDate: true, totalBudget: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      if (existingTrip) {
        await updateTrip(existingTrip.id, {
          title: form.title,
          description: form.description,
          startDate: form.startDate,
          endDate: form.endDate,
          totalBudget: Number(form.totalBudget || 0),
          coverImageUrl: form.coverImageUrl,
          status: form.status,
        });
        pushToast({ title: 'Trip updated', description: 'Your itinerary changes were saved.', variant: 'success' });
        navigate(`/trips/${existingTrip.id}`);
      } else {
        const created = await createTrip({
          userId: currentUser.id,
          title: form.title,
          description: form.description,
          startDate: form.startDate,
          endDate: form.endDate,
          totalBudget: Number(form.totalBudget || 0),
          coverImageUrl: form.coverImageUrl,
          status: form.status,
        });
        pushToast({ title: 'Trip created', description: 'Your new journey is ready.', variant: 'success' });
        navigate(`/trips/${created.id}`);
      }
    } catch (error) {
      pushToast({ title: 'Could not save trip', description: error.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (tripId && !existingTrip) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Trip not found"
        description="The itinerary you are trying to edit no longer exists."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (existingTrip && existingTrip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">{mode === 'edit' ? 'Edit trip' : 'Create trip'}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">{mode === 'edit' ? 'Refine the itinerary' : 'Plan a new trip'}</h1>
            <p className="mt-1 text-sm text-muted">Set the essentials first, then fill in stops, budget, packing, and notes from the trip hub.</p>
          </div>
          <Button as={Link} to="/trips" variant="secondary">
            Back to Trips
          </Button>
        </div>
      </section>

      <Card className="grid gap-0 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-5 p-6 lg:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Trip Name"
              value={form.title}
              onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
              onBlur={() => handleBlur('title')}
              error={touched.title ? errors.title : ''}
              placeholder="Europe Summer 2025"
              icon={<FileText className="h-4 w-4" />}
            />
            <Input
              label="Status"
              as="select"
              value={form.status}
              onChange={(event) => setForm((state) => ({ ...state, status: event.target.value }))}
            >
              {Object.entries(TRIP_STATUS_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </Input>
          </div>

          <Input
            label="Description"
            as="textarea"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))}
            onBlur={() => handleBlur('description')}
            error={touched.description ? errors.description : ''}
            placeholder="Describe the style, pace, and focus of the trip."
            className="min-h-[120px]"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(event) => setForm((state) => ({ ...state, startDate: event.target.value }))}
              onBlur={() => handleBlur('startDate')}
              error={touched.startDate ? errors.startDate : ''}
              icon={<CalendarDays className="h-4 w-4" />}
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(event) => setForm((state) => ({ ...state, endDate: event.target.value }))}
              onBlur={() => handleBlur('endDate')}
              error={touched.endDate ? errors.endDate : ''}
              icon={<CalendarDays className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Total Budget"
              type="number"
              min="0"
              step="0.01"
              value={form.totalBudget}
              onChange={(event) => setForm((state) => ({ ...state, totalBudget: event.target.value }))}
              onBlur={() => handleBlur('totalBudget')}
              error={touched.totalBudget ? errors.totalBudget : ''}
              placeholder="5000"
              icon={<Wallet className="h-4 w-4" />}
            />
            <Input
              label="Cover Image URL"
              value={form.coverImageUrl}
              onChange={(event) => setForm((state) => ({ ...state, coverImageUrl: event.target.value }))}
              placeholder="https://..."
              helperText="Optional. Used as the hero image on trip pages."
              icon={<Image className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" loading={loading}>
              {mode === 'edit' ? 'Save Changes' : 'Create Trip'}
            </Button>
            <Button as={Link} to="/trips" variant="secondary">
              Cancel
            </Button>
          </div>
        </form>

        <div className="border-t border-border bg-bg/50 p-6 lg:border-l lg:border-t-0 lg:p-8">
          <Badge tone={form.status === 'draft' ? 'amber' : form.status === 'ongoing' ? 'blue' : 'green'}>
            {TRIP_STATUS_META[form.status]?.label || 'Draft'}
          </Badge>
          <h2 className="mt-4 text-3xl text-text">
            {form.title || 'Your next trip starts here'}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Set the essentials first, then fill in stops, activities, budget, packing, and notes from the trip hub after save.
          </p>

          <div className="mt-6 space-y-3">
            {[
              'Trip detail page',
              'Itinerary builder',
              'Budget tracker',
              'Packing checklist',
              'Trip notes',
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3">
                <span className="text-sm text-text">{item}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Ready</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
