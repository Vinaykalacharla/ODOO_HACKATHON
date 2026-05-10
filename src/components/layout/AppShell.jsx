import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, Compass, Home, MapPinned, Settings, ShipWheel, LogOut, PlusCircle, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/trips', label: 'My Trips', icon: Compass },
  { to: '/trips/new', label: 'Create Trip', icon: PlusCircle },
  { to: '/cities', label: 'Cities', icon: MapPinned },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children }) {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const logout = useAuthStore((state) => state.logout);

  const showAdminLink = Boolean(currentUser?.isAdmin);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto grid min-h-screen max-w-[1680px] gap-6 p-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:p-6">
        <aside className="sticky top-6 h-fit overflow-hidden rounded-[2rem] border border-[#11264a] bg-[linear-gradient(180deg,#0f172a_0%,#111f3d_45%,#0b1324_100%)] p-5 text-white shadow-[0_30px_80px_rgba(2,6,23,0.28)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
              <Sparkles className="h-6 w-6 text-[#60a5fa]" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-white">Traveloop</p>
              <p className="text-xs text-white/[0.65]">Premium trip planning, done cleanly.</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/[0.55]">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-white">{currentUser?.name || 'Guest traveler'}</p>
            <p className="text-xs text-white/60">{currentUser?.email || 'Not signed in'}</p>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/[0.55]">Workspace</p>
                <p className="mt-1 text-sm font-medium text-white/90">Focused trip management</p>
              </div>
              <ShipWheel className="h-5 w-5 text-[#93c5fd]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">Plan routes, budgets, packing, and public itineraries from one booking-style workspace.</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition duration-200',
                      isActive
                      ? 'border-white/[0.15] bg-white/[0.12] text-white shadow-[0_16px_35px_rgba(2,6,23,0.18)]'
                      : 'border-transparent text-white/[0.72] hover:border-white/10 hover:bg-white/[0.08] hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4 text-[#93c5fd]" />
                  {item.label}
                </NavLink>
              );
            })}

            {showAdminLink ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition duration-200',
                    isActive
                      ? 'border-[#7dd3fc]/30 bg-[#0ea5e9]/20 text-white shadow-[0_16px_35px_rgba(14,165,233,0.2)]'
                      : 'border-transparent text-white/[0.72] hover:border-white/10 hover:bg-white/[0.08] hover:text-white',
                  )
                }
              >
                <BarChart3 className="h-4 w-4 text-[#7dd3fc]" />
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/[0.55]">Active route</p>
            <p className="mt-2 break-all text-sm text-white/80">{location.pathname}</p>
          </div>

          <Button
            variant="secondary"
            className="mt-6 w-full justify-center border-white/10 bg-white text-text hover:bg-[#f6f9ff]"
            onClick={async () => {
              await logout();
              window.location.assign('/login');
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </aside>

        <main className="min-w-0 rounded-[2rem] border border-border/70 bg-surface/96 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Journey workspace</p>
              <p className="mt-1 text-sm text-text">
                {currentUser?.name ? `Planning as ${currentUser.name}` : 'Travel planning workspace'}
              </p>
            </div>
            <div className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {location.pathname}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
