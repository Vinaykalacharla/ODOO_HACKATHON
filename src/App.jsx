import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout
import AppShell from './components/layout/AppShell';

// Pages
import AuthPage from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyTripsPage from './pages/trips/MyTripsPage';
import CreateTripPage from './pages/trips/CreateTripPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import ItineraryBuilderPage from './pages/trips/ItineraryBuilderPage';
import ItineraryViewPage from './pages/trips/ItineraryViewPage';
import BudgetPage from './pages/budget/BudgetPage';
import PackingPage from './pages/packing/PackingPage';
import NotesPage from './pages/notes/NotesPage';
import PublicItineraryPage from './pages/public/PublicItineraryPage';
import AdminPage from './pages/admin/AdminPage';
import SettingsPage from './pages/settings/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <AppShell>{children}</AppShell> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.is_admin) return <Navigate to="/dashboard" />;
  return <AppShell>{children}</AppShell>;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/share/:token" element={<PublicItineraryPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      
      <Route path="/trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
      <Route path="/trips/new" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId/edit" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId/builder" element={<ProtectedRoute><ItineraryBuilderPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId/view" element={<ProtectedRoute><ItineraryViewPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId/packing" element={<ProtectedRoute><PackingPage /></ProtectedRoute>} />
      <Route path="/trips/:tripId/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
