
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Toast } from '@/hooks/auth/types';
import { useAdminAuthChecker } from './useAdminAuthChecker';
import { useRouteProtection } from './useRouteProtection';
import { useSessionManager } from './useSessionManager';

interface UseAuthListenerProps {
  isAdminMode: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  checkIsAdmin: (userId: string) => Promise<boolean>;
  checkOnboardingStatus: (userId: string) => Promise<void>;
  navigate: NavigateFunction;
  toast: Toast;
}

export const useAuthListener = ({
  isAdminMode,
  setSession,
  setUser,
  setLoading,
  setIsAdmin,
  checkIsAdmin,
  checkOnboardingStatus,
  navigate,
  toast
}: UseAuthListenerProps) => {
  // Get helper hooks
  const { checkAdminAccess } = useAdminAuthChecker(navigate, toast, setIsAdmin);
  const { checkProtectedRoute } = useRouteProtection(navigate);
  const { getCurrentSession, setupSessionSubscription } = useSessionManager({
    setSession,
    setUser,
    setLoading
  });

  // Listen for auth state changes and check for existing session
  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener
    const subscription = setupSessionSubscription();
    
    // Check for existing session
    const checkSession = async () => {
      try {
        setLoading(true);
        const { session, user } = await getCurrentSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (!isMounted) return;
        
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          const adminMode = localStorage.getItem('isAdminMode') === 'true';
          
          if (adminMode || isAdminMode) {
            // Check if user is admin and handle routing
            const { redirected } = await checkAdminAccess(session.user.id, session, isAdminMode);
            
            if (redirected || !isMounted) {
              setLoading(false);
              return;
            }
            
            // If not redirected but not admin, proceed with regular user flow
            if (!adminMode && !isAdminMode) {
              setSession(session);
              setUser(user);
              setLoading(false);
              
              // Use setTimeout to prevent potential deadlock
              setTimeout(async () => {
                if (isMounted) {
                  await checkOnboardingStatus(session.user.id);
                }
              }, 0);
            }
          } else {
            // Regular user flow
            setSession(session);
            setUser(user);
            setLoading(false);
            
            // Use setTimeout to prevent potential deadlock
            setTimeout(async () => {
              if (isMounted) {
                await checkOnboardingStatus(session.user.id);
              }
            }, 0);
          }
        } else {
          // No session
          setSession(null);
          setUser(null);
          setLoading(false);
          
          // Check if trying to access protected routes
          if (isMounted) {
            checkProtectedRoute();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
          
          // Always redirect to login on error for security
          if (window.location.pathname !== '/login') {
            navigate('/login');
          }
        }
      }
    };
    
    checkSession();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [
    navigate, 
    isAdminMode, 
    toast, 
    checkOnboardingStatus, 
    checkIsAdmin, 
    setSession, 
    setUser, 
    setLoading, 
    setIsAdmin,
    checkAdminAccess,
    checkProtectedRoute
  ]);
};
