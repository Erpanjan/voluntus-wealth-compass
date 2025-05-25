
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

interface AuthCache {
  timestamp: number;
  data: AuthState;
  ttl: number;
}

const AUTH_CACHE_KEY = 'auth_cache';
const AUTH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useOptimizedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  });

  // Memoized cache operations
  const getCachedAuth = useCallback((): AuthState | null => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (!cached) return null;

      const parsedCache: AuthCache = JSON.parse(cached);
      const now = Date.now();
      
      if (now - parsedCache.timestamp > parsedCache.ttl) {
        localStorage.removeItem(AUTH_CACHE_KEY);
        return null;
      }

      return parsedCache.data;
    } catch {
      localStorage.removeItem(AUTH_CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedAuth = useCallback((data: AuthState) => {
    try {
      const cache: AuthCache = {
        timestamp: Date.now(),
        data,
        ttl: AUTH_CACHE_TTL
      };
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cache));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      return !!data;
    } catch {
      return false;
    }
  }, []);

  const updateAuthState = useCallback((newState: Partial<AuthState>) => {
    setAuthState(prev => {
      const updated = { ...prev, ...newState };
      setCachedAuth(updated);
      return updated;
    });
  }, [setCachedAuth]);

  // Initialize auth state with cache
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // Try cache first
      const cached = getCachedAuth();
      if (cached && cached.session) {
        setAuthState(cached);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (session) {
          const isAdmin = await checkAdminStatus(session.user.id);
          
          if (isMounted) {
            updateAuthState({
              user: session.user,
              session,
              loading: false,
              isAdmin
            });
          }
        } else {
          updateAuthState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false
          });
        }
      } catch {
        if (isMounted) {
          updateAuthState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false
          });
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [getCachedAuth, updateAuthState, checkAdminStatus]);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem(AUTH_CACHE_KEY);
          updateAuthState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false
          });
        } else if (session) {
          const isAdmin = await checkAdminStatus(session.user.id);
          updateAuthState({
            user: session.user,
            session,
            loading: false,
            isAdmin
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [updateAuthState, checkAdminStatus]);

  // Memoized logout function
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(AUTH_CACHE_KEY);
      // Clear all user-specific cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('user:') || key.includes('onboarding')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return useMemo(() => ({
    ...authState,
    logout
  }), [authState, logout]);
};
