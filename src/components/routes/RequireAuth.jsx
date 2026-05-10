import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function RequireAuth({ children }) {
  const currentUser = useAuthStore((state) => state.getCurrentUser());

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
