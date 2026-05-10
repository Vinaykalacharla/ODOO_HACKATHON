import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateTripPage from './pages/trips/CreateTripPage';
import MyTripsPage from './pages/trips/MyTripsPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import ItineraryBuilderPage from './pages/trips/ItineraryBuilderPage';
import ItineraryViewPage from './pages/trips/ItineraryViewPage';
import CitiesPage from './pages/cities/CitiesPage';
import ActivitySearchPage from './pages/cities/ActivitySearchPage';
import BudgetPage from './pages/budget/BudgetPage';
import PackingPage from './pages/packing/PackingPage';
import NotesPage from './pages/notes/NotesPage';
import PublicItineraryPage from './pages/public/PublicItineraryPage';
import SettingsPage from './pages/settings/SettingsPage';
import AdminPage from './pages/admin/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import AppShell from './components/layout/AppShell';
import RequireAuth from './components/routes/RequireAuth';
import RequireAdmin from './components/routes/RequireAdmin';
import ToastHost from './components/ui/ToastHost';
import { useAuthStore } from './store/authStore';

function PublicOnly({ children }) {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function Protected({ children }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}

function AdminProtected({ children }) {
  return (
    <RequireAuth>
      <AppShell>
        <RequireAdmin>{children}</RequireAdmin>
      </AppShell>
    </RequireAuth>
  );
}

function RootRedirect() {
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  return <Navigate to={currentUser ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <>
      <ToastHost />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <AuthPage />
            </PublicOnly>
          }
        />
        <Route path="/share/:token" element={<PublicItineraryPage />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
          path="/trips"
          element={
            <Protected>
              <MyTripsPage />
            </Protected>
          }
        />
        <Route
          path="/trips/new"
          element={
            <Protected>
              <CreateTripPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId/edit"
          element={
            <Protected>
              <CreateTripPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId"
          element={
            <Protected>
              <TripDetailPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId/builder"
          element={
            <Protected>
              <ItineraryBuilderPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId/view"
          element={
            <Protected>
              <ItineraryViewPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId/budget"
          element={
            <Protected>
              <BudgetPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId/packing"
          element={
            <Protected>
              <PackingPage />
            </Protected>
          }
        />
        <Route
          path="/trips/:tripId/notes"
          element={
            <Protected>
              <NotesPage />
            </Protected>
          }
        />
        <Route
          path="/cities"
          element={
            <Protected>
              <CitiesPage />
            </Protected>
          }
        />
        <Route
          path="/cities/:cityId/activities"
          element={
            <Protected>
              <ActivitySearchPage />
            </Protected>
          }
        />
        <Route
          path="/settings"
          element={
            <Protected>
              <SettingsPage />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminPage />
            </AdminProtected>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
