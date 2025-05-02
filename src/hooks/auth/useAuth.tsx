
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useOnboardingStatus } from './useOnboardingStatus';
import { useDemoAccount } from './useDemoAccount';
import { clearUserStateFlags } from './useLocalStorage';

export const useAuth = (isAdminMode: boolean = false) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkOnboardingStatus } = useOnboardingStatus(navigate);
  const { handleDemoLogin } = useDemoAccount(isAdminMode);
  const { 
    session, 
    setSession, 
    user, 
    setUser, 
    loading, 
    setLoading, 
    isAdmin, 
    setIsAdmin, 
    checkIsAdmin 
  } = useAuthState();

  // Check if user is already logged in
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check if the user is an admin by querying the profiles table
          if (isAdminMode) {
            const isUserAdmin = await checkIsAdmin(session.user.id);
            
            if (!isUserAdmin) {
              toast({
                title: "Access Denied",
                description: "Your account does not have admin privileges.",
                variant: "destructive",
                duration: 5000,
              });
              
              // Sign out if not an admin but trying to access admin portal
              await supabase.auth.signOut();
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('isAdminMode');
              navigate('/login');
            } else {
              localStorage.setItem('isAdminMode', 'true');
              setIsAdmin(true);
              navigate('/admin/dashboard');
            }
          } else {
            localStorage.removeItem('isAdminMode');
            
            // Handle regular user flow based on onboarding status
            if (event === 'SIGNED_IN') {
              await checkOnboardingStatus(session.user.id);
            }
          }
        }
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session?.user?.id);
      
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
        
        // Check localStorage for admin mode
        const adminMode = localStorage.getItem('isAdminMode') === 'true';
        
        if (adminMode || isAdminMode) {
          const isUserAdmin = await checkIsAdmin(session.user.id);
          
          setIsAdmin(isUserAdmin);
          
          if (isUserAdmin) {
            localStorage.setItem('isAdminMode', 'true');
            navigate('/admin/dashboard');
          } else {
            // If not an admin but trying to access admin routes,
            // redirect to regular dashboard
            localStorage.removeItem('isAdminMode');
            
            if (isAdminMode) {
              toast({
                title: "Access Denied",
                description: "Your account does not have admin privileges.",
                variant: "destructive",
                duration: 5000,
              });
              navigate('/login');
            } else {
              // Check onboarding status for regular users
              await checkOnboardingStatus(session.user.id);
            }
          }
        } else {
          // Check onboarding status for regular users
          await checkOnboardingStatus(session.user.id);
        }
      }
      
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };
    
    checkSession();
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, isAdminMode, toast, checkOnboardingStatus, checkIsAdmin, setSession, setUser, setLoading, setIsAdmin]);

  // Handle regular login success
  const handleRegularLogin = () => {
    // Navigation is already handled in the auth state change listener
  };

  return {
    loading,
    isAdmin,
    session,
    user,
    handleDemoLogin,
    handleRegularLogin,
    clearUserStateFlags
  };
};

export default useAuth;
