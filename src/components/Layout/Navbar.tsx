import React, { useState } from 'react';
import { LogOut, Home, Plus, Settings, Users } from 'lucide-react';
import { signOut } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import { PointsBadge } from '../Rewards/PointsBadge';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const { user, userRole } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSignOutError(null);
    setSigningOut(true);
    try {
      await signOut();
      // App-level auth hook should transition to AuthPage automatically.
      // Fallback in case the provider hangs: after 2s, force-clear mock session and notify listeners.
      setTimeout(() => {
        try {
          const saved = localStorage.getItem('mockAuth_currentUser');
          if (saved) {
            localStorage.removeItem('mockAuth_currentUser');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('mock-auth-changed'));
            }
          }
        } catch {}
      }, 2000);
    } catch (e: any) {
      setSignOutError(e?.message || 'Failed to sign out. Please try again.');
    } finally {
      // Always re-enable the button, UI will still switch to AuthPage via useAuth when session clears
      setSigningOut(false);
    }
  };

  const citizenNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'report', label: 'Report Issue', icon: Plus },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const authorityNavItems = [
    { id: 'authority-dashboard', label: 'Dashboard', icon: Home },
    { id: 'manage-issues', label: 'Manage Issues', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Settings },
  ];

  const navItems = userRole === 'authority' ? authorityNavItems : citizenNavItems;

  return (
    <nav className="sticky top-0 z-40 glass border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">CivicConnect</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 ${
                        currentView === item.id
                          ? 'bg-brand-50 text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.user_metadata?.name || user?.email}
            </span>
            <PointsBadge />
            <NotificationBell />
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 ${signingOut ? 'opacity-60 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              title={signOutError || ''}
            >
              <LogOut className="w-4 h-4" />
              <span>{signingOut ? 'Signing out…' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-slate-200/70 bg-white/60 backdrop-blur">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 ${
                  currentView === item.id
                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};