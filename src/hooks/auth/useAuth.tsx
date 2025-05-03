
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useOnboardingStatus } from './useOnboardingStatus';
import { useEffect } from 'react';
import { useAuthListener } from './useAuthListener';
import { useAuthSession } from './useAuthSession';
import { clearUserStateFlags } from './useLocalStorage';

export const useAuth = (isAdminMode: boolean = false) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkOnboardingStatus } = useOnboardingStatus(navigate);
  
  // Get auth state from the hook
  const { 
    session, 
    user, 
    loading, 
    isAdmin, 
    setSession, 
    setUser, 
    setLoading, 
    setIsAdmin
  } = useAuthState();
  
  // Use custom hooks for auth session and listener with improved memoization
  const { checkIsAdmin } = useAuthSession(setIsAdmin);
  
  // Set up auth state listener with optimized dependencies
  useAuthListener({
    isAdminMode,
    setSession,
    setUser,
    setLoading,
    setIsAdmin,
    checkIsAdmin,
    checkOnboardingStatus,
    navigate,
    toast
  });
  
  // Handle successful login by verifying current session and enforcing route protection
  const handleRegularLogin = async () => {
    try {
      // Use cached session data when possible to avoid unnecessary API calls
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        console.log("Login confirmed, proceeding with onboarding status check");
        // Use a promise to handle the navigation more efficiently
        await checkOnboardingStatus(currentSession.user.id);
        return true;
      } else {
        console.log("Session verification failed after login attempt");
        navigate('/login');
        return false;
      }
    } catch (error) {
      console.error("Error during login handling:", error);
      navigate('/login');
      return false;
    }
  };

  return {
    loading,
    isAdmin,
    session,
    user,
    handleRegularLogin,
    clearUserStateFlags
  };
};

export default useAuth;
