
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

  // Handle regular login success
  const handleRegularLogin = () => {
    // Navigation is already handled in the auth state change listener
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
