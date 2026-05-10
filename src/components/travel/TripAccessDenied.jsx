import { Lock } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function TripAccessDenied({ actionLabel = 'Back to trips', onAction }) {
  return (
    <EmptyState
      icon={Lock}
      title="Trip access denied"
      description="You do not have permission to view or edit this itinerary."
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
