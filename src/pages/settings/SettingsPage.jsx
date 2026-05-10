import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockKeyhole, UserRound } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TripCard from '../../components/travel/TripCard';
import EmptyState from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { getOwnedTrips } from '../../lib/selectors';
import { validatePasswordChange, validateProfile } from '../../lib/validators';

export default function SettingsPage() {
  const navigate = useNavigate();
  const state = useTravelStore((current) => current);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const updateProfile = useAuthStore((store) => store.updateProfile);
  const changePassword = useAuthStore((store) => store.changePassword);
  const pushToast = useToastStore((store) => store.pushToast);
  const trips = useMemo(() => getOwnedTrips(state, currentUser?.id), [state, currentUser?.id]);

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', nextPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfile({ name: currentUser.name, email: currentUser.email });
      setProfileTouched({});
    }
  }, [currentUser]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    const nextErrors = validateProfile(profile);
    setProfileTouched({ name: true, email: true });
    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setProfileLoading(true);
    try {
      await updateProfile(profile);
      pushToast({ title: 'Profile updated', description: 'Your account details were saved.', variant: 'success' });
    } catch (error) {
      pushToast({ title: 'Profile update failed', description: error.message, variant: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    const nextErrors = validatePasswordChange(passwordForm);
    setPasswordTouched({ currentPassword: true, nextPassword: true, confirmPassword: true });
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setPasswordLoading(true);
    try {
      await changePassword(passwordForm);
      pushToast({ title: 'Password changed', description: 'Your password was updated.', variant: 'success' });
      setPasswordForm({ currentPassword: '', nextPassword: '', confirmPassword: '' });
    } catch (error) {
      pushToast({ title: 'Password update failed', description: error.message, variant: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!currentUser) {
    return <EmptyState icon={UserRound} title="Not signed in" description="Sign in to manage your profile." actionLabel="Login" onAction={() => navigate('/login')} />;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Settings</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">Profile and account</h1>
          <p className="mt-1 text-sm text-muted">Update your account details, password, and saved trip access.</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <h2 className="text-2xl text-text">Profile</h2>
          <form className="mt-5 space-y-4" onSubmit={handleProfileSave}>
            <Input
              label="Name"
              value={profile.name}
              onChange={(event) => setProfile((state) => ({ ...state, name: event.target.value }))}
              onBlur={() => {
                setProfileTouched((state) => ({ ...state, name: true }));
                setProfileErrors(validateProfile(profile));
              }}
              error={profileTouched.name ? profileErrors.name : ''}
              icon={<UserRound className="h-4 w-4" />}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(event) => setProfile((state) => ({ ...state, email: event.target.value }))}
              onBlur={() => {
                setProfileTouched((state) => ({ ...state, email: true }));
                setProfileErrors(validateProfile(profile));
              }}
              error={profileTouched.email ? profileErrors.email : ''}
            />
            <Button type="submit" loading={profileLoading} className="w-full">
              Save Profile
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-2xl text-text">Change Password</h2>
          <form className="mt-5 space-y-4" onSubmit={handlePasswordSave}>
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((state) => ({ ...state, currentPassword: event.target.value }))}
              onBlur={() => {
                setPasswordTouched((state) => ({ ...state, currentPassword: true }));
                setPasswordErrors(validatePasswordChange(passwordForm));
              }}
              error={passwordTouched.currentPassword ? passwordErrors.currentPassword : ''}
              icon={<LockKeyhole className="h-4 w-4" />}
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.nextPassword}
              onChange={(event) => setPasswordForm((state) => ({ ...state, nextPassword: event.target.value }))}
              onBlur={() => {
                setPasswordTouched((state) => ({ ...state, nextPassword: true }));
                setPasswordErrors(validatePasswordChange(passwordForm));
              }}
              error={passwordTouched.nextPassword ? passwordErrors.nextPassword : ''}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((state) => ({ ...state, confirmPassword: event.target.value }))}
              onBlur={() => {
                setPasswordTouched((state) => ({ ...state, confirmPassword: true }));
                setPasswordErrors(validatePasswordChange(passwordForm));
              }}
              error={passwordTouched.confirmPassword ? passwordErrors.confirmPassword : ''}
            />
            <Button type="submit" loading={passwordLoading} className="w-full">
              Update Password
            </Button>
          </form>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl text-text">Saved and Public Trips</h2>
            <p className="mt-1 text-sm text-muted">Trips owned by your account.</p>
          </div>
          <Button as={Link} to="/trips/new" variant="secondary">
            New Trip
          </Button>
        </div>

        {trips.length > 0 ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {trips.map((trip) => {
              const stops = state.tripStops.filter((stop) => stop.tripId === trip.id);
              const cityNames = stops
                .slice()
                .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder))
                .map((stop) => state.cities.find((city) => city.id === stop.cityId)?.name)
                .filter(Boolean);
              return <TripCard key={trip.id} trip={trip} cityNames={cityNames} stopCount={stops.length} showActions={false} />;
            })}
          </div>
        ) : (
          <EmptyState
            icon={UserRound}
            title="No trips yet"
            description="Your saved trips will appear here after you create them."
            actionLabel="Create Trip"
            onAction={() => navigate('/trips/new')}
          />
        )}
      </Card>
    </div>
  );
}
