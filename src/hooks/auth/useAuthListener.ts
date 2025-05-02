
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Toast } from '@/hooks/auth/types';

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
  // Listen for auth state changes and check for existing session
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check if the user is an admin by querying the profiles table
          const isUserAdmin = await checkIsAdmin(session.user.id);
          
          if (isAdminMode || isUserAdmin) {
            // Handle admin authentication flow
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
              // User is admin and trying to access admin portal
              localStorage.setItem('isAdminMode', 'true');
              setIsAdmin(true);
              navigate('/admin/dashboard');
            }
          } else {
            // Handle regular user flow
            localStorage.removeItem('isAdminMode');
            
            // Only check onboarding status for non-admin mode
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
        
        // Check if the user is an admin first
        const isUserAdmin = await checkIsAdmin(session.user.id);
        setIsAdmin(isUserAdmin);
        
        // Check localStorage for admin mode
        const adminMode = localStorage.getItem('isAdminMode') === 'true';
        
        // Admin flow has priority - if admin mode is active or user is admin
        if (adminMode || isAdminMode) {
          if (isUserAdmin) {
            // User is verified admin, set admin mode and redirect
            localStorage.setItem('isAdminMode', 'true');
            navigate('/admin/dashboard');
          } else {
            // Not an admin but trying to access admin routes
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
              // Check onboarding for regular users
              await checkOnboardingStatus(session.user.id);
            }
          }
        } else if (isUserAdmin) {
          // User is admin but not in admin mode, ask if they want to go to admin dashboard
          toast({
            title: "Admin Account Detected",
            description: "You are logged in as an admin. You can access the admin dashboard.",
            duration: 5000,
          });
          // Still follow regular flow for now
          await checkOnboardingStatus(session.user.id);
        } else {
          // Regular user flow
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
};
