import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bg px-4 py-10">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The route does not exist in this Traveloop build."
        actionLabel="Go home"
        onAction={() => navigate('/dashboard')}
      />
    </div>
  );
}
