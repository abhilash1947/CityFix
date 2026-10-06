import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Helper to convert mock user to Supabase-like user
    const setUserFromMock = () => {
      const mockUser = getCurrentUser();
      if (mockUser) {
        const supabaseUser = {
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: {
            name: mockUser.name,
            phone: mockUser.phone,
            role: mockUser.role,
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: mockUser.created_at,
        } as unknown as User;
        setUser(supabaseUser);
        setLoading(false);
        return true;
      }
      return false;
    };

    // Check for mock user first
    if (setUserFromMock()) return;

    // Fallback to real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Listen for mock auth custom event (signIn/signOut/signUp)
    const onMockAuthChanged = () => {
      if (!setUserFromMock()) {
        // If no mock user, clear user
        setUser(null);
      }
      setLoading(false);
    };
    window.addEventListener('mock-auth-changed', onMockAuthChanged);

    // Also listen to storage updates for cross-tab changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'mockAuth_currentUser') {
        onMockAuthChanged();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('mock-auth-changed', onMockAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const userRole = user?.user_metadata?.role || 'citizen';

  return {
    user,
    loading,
    userRole,
    isAuthenticated: !!user,
  };
};