
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type SessionStateSetters = {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useSessionManager = ({ setSession, setUser, setLoading }: SessionStateSetters) => {
  // Get the current session state
  const getCurrentSession = async (): Promise<{ session: Session | null; user: User | null }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return {
        session,
        user: session?.user || null
      };
    } catch (error) {
      console.error('Error fetching current session:', error);
      return {
        session: null,
        user: null
      };
    }
  };

  // Setup session subscription
  const setupSessionSubscription = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user || null);
      
      // Store authentication state in localStorage
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdminMode');
        localStorage.removeItem('onboardingComplete');
      }
    });
    
    return subscription;
  };

  return {
    getCurrentSession,
    setupSessionSubscription,
  };
};
