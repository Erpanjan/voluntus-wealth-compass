
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';

export const useDashboardAuth = () => {
  const { user, session, loading, logout: optimizedLogout } = useOptimizedAuth();
  const [authorized, setAuthorized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuthAndApproval = async () => {
      if (!session) {
        console.log('No valid session found in Dashboard page, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      
      // Use cached status if available to avoid DB query
      const cachedStatus = localStorage.getItem(`user:${session.user.id}:onboardingStatus`);
      const cachedTimestamp = localStorage.getItem(`user:${session.user.id}:onboardingStatusTimestamp`);
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
      const now = Date.now();
      
      if (cachedStatus && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < CACHE_TTL) {
        if (cachedStatus === 'approved') {
          if (isMounted) setAuthorized(true);
        } else {
          checkDatabaseStatus();
        }
      } else {
        checkDatabaseStatus();
      }
      
      async function checkDatabaseStatus() {
        try {
          const { data, error } = await supabase
            .from('onboarding_data')
            .select('status')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error checking onboarding status:', error);
            toast({
              title: "Warning",
              description: "Could not verify your account status. Some features may be limited.",
              variant: "destructive",
            });
            if (isMounted) setAuthorized(true);
          } else if (data) {
            localStorage.setItem(`user:${session.user.id}:onboardingStatus`, data.status);
            localStorage.setItem(`user:${session.user.id}:onboardingStatusTimestamp`, now.toString());
            
            if (data.status === 'draft') {
              navigate('/welcome', { replace: true });
              return;
            } else if (data.status === 'submitted' || data.status === 'pending') {
              navigate('/pending-approval', { replace: true });
              return;
            } else if (data.status === 'approved') {
              if (isMounted) setAuthorized(true);
            } else {
              navigate('/welcome', { replace: true });
              return;
            }
          } else {
            navigate('/welcome', { replace: true });
            return;
          }
        } catch (error) {
          console.error('Database check error:', error);
          if (isMounted) setAuthorized(true); // Allow access on error
        }
      }
    };
    
    if (!loading) {
      checkAuthAndApproval();
    }
    
    return () => {
      isMounted = false;
    };
  }, [session, loading, navigate, toast]);

  const handleLogout = useCallback(async () => {
    try {
      console.log('Client logout initiated');
      
      document.body.classList.add('login-transition');
      
      toast({
        title: "Logging out...",
        description: "You will be redirected to the login page."
      });
      
      await optimizedLogout();
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      clearUserStateFlags();
      
      toast({
        title: "Error logging out",
        description: error.message || "There was a problem logging you out.",
        variant: "destructive"
      });
      
      window.location.href = '/login';
    }
  }, [optimizedLogout, toast]);

  return {
    user,
    session,
    loading,
    authorized,
    handleLogout
  };
};
