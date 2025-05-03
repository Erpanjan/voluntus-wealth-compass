
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
  
  // Use custom hooks for auth session and listener
  const { checkIsAdmin } = useAuthSession(setIsAdmin);
  
  // Set up auth state listener
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
    // Set loading to true during login handling
    setLoading(true);
    
    try {
      // Additional check to verify session is valid before navigating
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        console.log("Login confirmed, proceeding with onboarding status check");
        // The navigation will be handled by the checkOnboardingStatus function
        await checkOnboardingStatus(currentSession.user.id);
      } else {
        console.log("Session verification failed after login attempt");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error handling login:", error);
      navigate('/login');
    } finally {
      // Always set loading to false when done
      setLoading(false);
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
