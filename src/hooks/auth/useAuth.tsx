
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useOnboardingStatus } from './useOnboardingStatus';
import { useDemoAccount } from './useDemoAccount';
import { useEffect } from 'react';
import { useAuthListener } from './useAuthListener';
import { useAuthSession } from './useAuthSession';
import { clearUserStateFlags, clearPortalSpecificFlags } from './useLocalStorage';
import { usePortalContext, PortalType } from './usePortalContext';

export const useAuth = (isAdminMode: boolean = false) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkOnboardingStatus } = useOnboardingStatus(navigate);
  
  // Determine portal type based on admin mode
  const portalType: PortalType = isAdminMode ? 'admin' : 'client';
  const { switchToPortal, portalType: currentPortal } = usePortalContext(portalType);
  
  // Update portal context when admin mode changes
  useEffect(() => {
    // Only switch if the portal type has changed
    if (currentPortal !== portalType) {
      console.log(`Portal context updated from ${currentPortal} to ${portalType}`);
      switchToPortal(isAdminMode ? 'admin' : 'client');
    }
  }, [isAdminMode, switchToPortal, portalType, currentPortal]);
  
  // Demo account functionality
  const { handleDemoLogin } = useDemoAccount(isAdminMode);
  
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
  
  // Set up auth state listener with portal awareness
  useAuthListener({
    isAdminMode,
    setSession,
    setUser,
    setLoading,
    setIsAdmin,
    checkIsAdmin,
    checkOnboardingStatus,
    navigate,
    toast,
    portalType
  });

  // Handle logout with portal context awareness
  const handleLogout = async (redirectTo: string = '/login') => {
    try {
      console.log(`Logging out from ${portalType} portal...`);
      
      // Add transition class for visual feedback
      document.body.classList.add('logout-transition');
      
      // Clear state based on current portal context
      if (portalType === 'admin') {
        clearPortalSpecificFlags('admin');
        localStorage.removeItem('isAdminMode');
      } else {
        clearPortalSpecificFlags('client');
      }
      
      // Always clear authentication state for the current portal
      localStorage.removeItem('isAuthenticated');
      
      // Reset portal context to client for login page
      localStorage.setItem('portalContext', 'client');
      switchToPortal('client');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out successfully",
        description: `You have been logged out of the ${portalType} portal.`
      });
      
      // Small delay for transitioning
      setTimeout(() => {
        navigate(redirectTo);
      }, 300);
    } catch (error: any) {
      console.error(`Logout error in ${portalType} portal:`, error);
      
      toast({
        title: "Error logging out",
        description: error.message || "There was a problem logging you out.",
        variant: "destructive"
      });
    } finally {
      // Remove transition class
      setTimeout(() => {
        document.body.classList.remove('logout-transition');
      }, 500);
    }
  };

  // Handle regular login success with portal awareness
  const handleRegularLogin = () => {
    // Navigation is already handled in the auth state change listener
    switchToPortal(isAdminMode ? 'admin' : 'client');
  };

  return {
    loading,
    isAdmin,
    session,
    user,
    portalType,
    handleDemoLogin,
    handleRegularLogin,
    handleLogout,
    clearUserStateFlags,
    switchToPortal
  };
};

export default useAuth;
