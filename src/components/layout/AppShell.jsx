import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Plane,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const AppShell = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Trips', icon: Map, path: '/trips' },
    { label: 'New Trip', icon: PlusCircle, path: '/trips/new' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (user?.is_admin) {
    navItems.push({ label: 'Admin', icon: ShieldCheck, path: '/admin' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-surface border-r border-border h-screen sticky top-0">
        <div className="p-8 flex items-center gap-3">
          <Plane className="h-8 w-8 text-accent rotate-45" />
          <h2 className="text-2xl text-text">Traveloop</h2>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${isActive(item.path) 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-muted hover:bg-bg hover:text-text'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-danger hover:bg-danger/5 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-accent rotate-45" />
          <h2 className="text-xl">Traveloop</h2>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-surface pt-20 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl font-bold
                ${isActive(item.path) ? 'bg-accent/10 text-accent' : 'text-muted'}`}
            >
              <item.icon className="h-6 w-6" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-danger"
          >
            <LogOut className="h-6 w-6" />
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 pt-24 md:pt-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
