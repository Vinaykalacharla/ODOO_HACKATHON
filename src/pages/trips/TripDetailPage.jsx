import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, Compass, Copy, Layers3, MapPin, NotebookPen, PackageCheck, PencilLine, Wallet } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import TripSubnav from '../../components/travel/TripSubnav';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import HealthScoreGauge from '../../components/travel/HealthScoreGauge';
import BudgetPulseBar from '../../components/travel/BudgetPulseBar';
import { useTravelStore } from '../../store/travelStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { useTripBundle } from '../../hooks/useTripBundle';
import { formatCurrency, formatDateRange } from '../../lib/format';
import { TRIP_STATUS_META } from '../../lib/meta';

function NavigationCard({ icon: Icon, title, description, to }) {
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted" />
      </div>
      <h3 className="mt-4 text-2xl text-text">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <Button as={Link} to={to} variant="secondary" className="mt-5 w-full">
        Open
      </Button>
    </Card>
  );
}

export default function TripDetailPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const bundle = useTripBundle(tripId);
  const pushToast = useToastStore((store) => store.pushToast);
  const toggleTripVisibility = useTravelStore((store) => store.toggleTripVisibility);
  const currentUser = useAuthStore((state) => state.users.find((user) => user.id === state.currentUserId));

  const isOwner = bundle?.trip?.userId === currentUser?.id;
  if (!bundle) {
    return (
      <EmptyState
        icon={Compass}
        title="Trip not found"
        description="The selected itinerary does not exist or was deleted."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (!isOwner && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const { trip, stops, tripActivities, packingItems, finances } = bundle;
  const statusMeta = TRIP_STATUS_META[trip.status] || TRIP_STATUS_META.draft;

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/share/${trip.shareToken}`;
    await navigator.clipboard.writeText(shareUrl);
    pushToast({ title: 'Share link copied', description: shareUrl, variant: 'success' });
  };

  const copyTrip = async () => {
    await navigator.clipboard.writeText(`${trip.title} - ${formatDateRange(trip.startDate, trip.endDate)}`);
    pushToast({ title: 'Trip copied', description: 'Copy flow completed in the demo UI.', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      <TripSubnav basePath={`/trips/${trip.id}`} />

      <section className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-soft">
        <div className="relative min-h-[280px] bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(15,118,110,0.15))]">
          {trip.coverImageUrl ? <img src={trip.coverImageUrl} alt={trip.title} className="h-full w-full object-cover opacity-85" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute left-0 top-0 h-full w-full p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl text-white">
                <Badge tone="gray" className="bg-white/90 text-text">
                  {statusMeta.label}
                </Badge>
                <h1 className="mt-4 text-5xl leading-tight lg:text-7xl">{trip.title}</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/90">{trip.description}</p>
                <p className="mt-3 text-sm text-white/80">{formatDateRange(trip.startDate, trip.endDate)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={copyTrip}>
                  <Copy className="h-4 w-4" />
                  Copy Trip
                </Button>
                {trip.isPublic ? (
                  <Button variant="secondary" onClick={copyShareLink}>
                    <Layers3 className="h-4 w-4" />
                    Copy Share Link
                  </Button>
                ) : null}
                {isOwner ? (
                  <Button variant="secondary" onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Stops</p>
            <p className="mt-2 text-3xl font-semibold text-text">{stops.length}</p>
            <p className="mt-1 text-sm text-muted">Cities in this trip</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Activities</p>
            <p className="mt-2 text-3xl font-semibold text-text">{tripActivities.length}</p>
            <p className="mt-1 text-sm text-muted">Scheduled experiences</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Budget</p>
            <p className="mt-2 text-3xl font-semibold text-text">{formatCurrency(trip.totalBudget)}</p>
            <p className="mt-1 text-sm text-muted">Trip budget ceiling</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Visibility</p>
            <p className="mt-2 text-3xl font-semibold text-text">{trip.isPublic ? 'Public' : 'Private'}</p>
            {isOwner ? (
              <Button
                className="mt-3 w-full"
                variant="secondary"
                onClick={async () => {
                  await toggleTripVisibility(trip.id);
                  pushToast({ title: 'Visibility changed', description: 'Trip visibility was updated.', variant: 'success' });
                }}
              >
                Toggle visibility
              </Button>
            ) : null}
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <HealthScoreGauge score={finances.healthScore} />
        <BudgetPulseBar budget={trip.totalBudget} spent={finances.totalSpent} activityCost={finances.activityCost} status={finances.budgetStatus} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NavigationCard
          icon={Compass}
          title="Itinerary Builder"
          description="Drag stops into the right order and attach activities for each city."
          to={`/trips/${trip.id}/builder`}
        />
        <NavigationCard
          icon={NotebookPen}
          title="Itinerary View"
          description="Read the trip in a clean timeline or list format by day."
          to={`/trips/${trip.id}/view`}
        />
        <NavigationCard
          icon={Wallet}
          title="Budget"
          description="Track actual spend, estimates, and category totals in one place."
          to={`/trips/${trip.id}/budget`}
        />
        <NavigationCard
          icon={PackageCheck}
          title="Packing"
          description="Manage a categorized packing checklist and monitor progress."
          to={`/trips/${trip.id}/packing`}
        />
        <NavigationCard
          icon={MapPin}
          title="Notes"
          description="Keep route notes, reminders, and stop-specific comments together."
          to={`/trips/${trip.id}/notes`}
        />
        <NavigationCard
          icon={Compass}
          title="City Search"
          description="Search the city catalog and add new stops to this trip."
          to={`/cities?tripId=${trip.id}`}
        />
      </section>
    </div>
  );
}
