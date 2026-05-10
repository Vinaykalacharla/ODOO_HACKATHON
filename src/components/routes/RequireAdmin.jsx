import Card from '../ui/Card';
import { useAuthStore } from '../../store/authStore';

function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl p-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-danger">403</p>
        <h2 className="mt-3 text-3xl font-semibold text-text">Admin access required</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          This area is restricted to admin users. Your account does not have the permissions needed to open this route.
        </p>
      </Card>
    </div>
  );
}

export default function RequireAdmin({ children }) {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  if (!currentUser?.isAdmin) {
    return <AccessDenied />;
  }
  return children;
}
