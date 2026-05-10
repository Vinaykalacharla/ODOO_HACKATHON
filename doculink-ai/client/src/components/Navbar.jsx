import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Button from './ui/Button';
import { Layout, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-accent h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <Layout className="text-white h-6 w-6" />
        </div>
        <span className="text-2xl font-serif font-bold tracking-tight">DocuLink <span className="text-accent">AI</span></span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2 bg-border/30 rounded-full">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                {user.name?.[0]}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="text-muted hover:text-danger transition-colors p-2"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-muted hover:text-text font-medium">Login</Link>
            <Button as={Link} to="/signup">Get Started</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
