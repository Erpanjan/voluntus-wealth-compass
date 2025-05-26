
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

export const useDashboardAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuthAndApproval = async () => {
      try {
        // Verify session exists
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No valid session found in Dashboard page, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        if (isMounted) {
          setUser(session.user);
          setSession(session);
        }
        
        // Verify this is the correct page based on onboarding status
        // Use cached status if available to avoid DB query
        const cachedStatus = localStorage.getItem(`user:${session.user.id}:onboardingStatus`);
        const cachedTimestamp = localStorage.getItem(`user:${session.user.id}:onboardingStatusTimestamp`);
        const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();
        
        if (cachedStatus && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < CACHE_TTL) {
          if (cachedStatus === 'approved') {
            if (isMounted) setAuthorized(true);
          } else {
            // Not approved or status changed - verify with database
            checkDatabaseStatus();
          }
        } else {
          // No cached status or cache expired - check database
          checkDatabaseStatus();
        }
        
        async function checkDatabaseStatus() {
          const { data, error } = await supabase
            .from('onboarding_data')
            .select('status')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error checking onboarding status:', error);
            // Show an error but allow access on error
            toast({
              title: "Warning",
              description: "Could not verify your account status. Some features may be limited.",
              variant: "destructive",
            });
            if (isMounted) setAuthorized(true);
          } else if (data) {
            // Cache the result in localStorage
            localStorage.setItem(`user:${session.user.id}:onboardingStatus`, data.status);
            localStorage.setItem(`user:${session.user.id}:onboardingStatusTimestamp`, now.toString());
            
            // If user hasn't submitted application yet, redirect to welcome
            if (data.status === 'draft') {
              navigate('/welcome', { replace: true });
              return;
            }
            // If user's application is pending, redirect to pending page
            else if (data.status === 'submitted' || data.status === 'pending') {
              navigate('/pending-approval', { replace: true });
              return;
            }
            // If approved, this is the correct page
            else if (data.status === 'approved') {
              if (isMounted) setAuthorized(true);
            } else {
              // Unknown status
              navigate('/welcome', { replace: true });
              return;
            }
          } else {
            // No onboarding data, redirect to welcome
            navigate('/welcome', { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    checkAuthAndApproval();
    
    // Also set up auth state listener for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogout = useCallback(async () => {
    try {
      console.log('Client logout initiated');
      
      // Get user ID before signing out
      const userId = session?.user?.id;
      
      // Add transition class for smooth logout experience
      document.body.classList.add('login-transition');
      
      // Start the Supabase sign out process immediately
      const signOutPromise = supabase.auth.signOut();
      
      // Clear all user-specific flags from localStorage immediately
      // This makes logout feel faster while the API call completes
      if (userId) {
        clearUserStateFlags(userId);
      } else {
        clearUserStateFlags();
      }
      
      // Show toast notification immediately for perceived speed
      toast({
        title: "Logging out...",
        description: "You will be redirected to the login page."
      });
      
      // Wait for the API call to complete
      await signOutPromise;
      
      // Hard redirect to login page to ensure clean state
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Force clear local storage even if API call fails
      clearUserStateFlags();
      
      toast({
        title: "Error logging out",
        description: error.message || "There was a problem logging you out.",
        variant: "destructive"
      });
      
      // Hard redirect to login page (forces page reload)
      window.location.href = '/login';
    }
  }, [session, toast]);

  return {
    user,
    session,
    loading,
    authorized,
    handleLogout
  };
};
