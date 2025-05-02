
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Toast } from '@/hooks/auth/types';
import { PortalType } from './usePortalContext';

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
  portalType?: PortalType;
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
  toast,
  portalType = 'client'
}: UseAuthListenerProps) => {
  // Listen for auth state changes and check for existing session
  useEffect(() => {
    // Update portal context in localStorage
    localStorage.setItem('portalContext', portalType);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed in ${portalType} portal:`, event, session?.user?.id);
        
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check if the user is an admin by querying the profiles table
          const isUserAdmin = await checkIsAdmin(session.user.id);
          setIsAdmin(isUserAdmin);
          
          // Handle different portal contexts
          // Admin portal flow with strict admin checking
          if (portalType === 'admin') {
            // Check if the user has admin privileges
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
              localStorage.setItem('portalContext', 'client');
              navigate('/login');
            } else {
              // User is admin and in admin portal - prioritize this flow
              localStorage.setItem('isAdminMode', 'true');
              localStorage.setItem('portalContext', 'admin');
              setIsAdmin(true);
              
              // Admin users always go to the admin dashboard, skip onboarding checks
              navigate('/admin/dashboard');
            }
          } 
          // Client portal flow - only run if explicitly in client portal
          else if (portalType === 'client') {
            // Remove admin mode flag if in client portal
            localStorage.removeItem('isAdminMode');
            localStorage.setItem('portalContext', 'client');
            
            // If admin is accessing client portal, show a message
            if (isUserAdmin) {
              toast({
                title: "Admin Account Notice",
                description: "You are using an admin account in client portal mode.",
                duration: 5000,
              });
            }
            
            // Only check onboarding status in client portal context
            // and only on SIGNED_IN event to prevent unnecessary redirects
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
      console.log(`Initial session check in ${portalType} portal:`, session?.user?.id);
      
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
        
        // Check if the user is an admin first
        const isUserAdmin = await checkIsAdmin(session.user.id);
        setIsAdmin(isUserAdmin);
        
        // Read the current portal context from localStorage
        const currentPortalContext = localStorage.getItem('portalContext') as PortalType || portalType;
        const adminMode = localStorage.getItem('isAdminMode') === 'true' || isAdminMode;
        
        // Admin portal flow - with strict admin checking
        if (portalType === 'admin') {
          // Verify admin status
          if (isUserAdmin) {
            // Set admin mode and redirect to admin dashboard
            localStorage.setItem('isAdminMode', 'true');
            localStorage.setItem('portalContext', 'admin');
            navigate('/admin/dashboard');
          } else {
            // Not an admin but trying to access admin routes
            localStorage.removeItem('isAdminMode');
            localStorage.setItem('portalContext', 'client');
            
            toast({
              title: "Access Denied",
              description: "Your account does not have admin privileges.",
              variant: "destructive",
              duration: 5000,
            });
            
            navigate('/login');
          }
        } 
        // Client portal flow - only when explicitly in client portal
        else if (portalType === 'client') {
          // If user is admin but in client context, set client context but maintain admin flag
          if (isUserAdmin) {
            localStorage.setItem('portalContext', 'client');
            localStorage.setItem('isAdminMode', 'true'); // Keep admin privileges flag
            
            toast({
              title: "Admin in Client Mode",
              description: "You are browsing in client mode with admin privileges.",
              duration: 5000,
            });
          } else {
            // Normal client user
            localStorage.setItem('portalContext', 'client');
            localStorage.removeItem('isAdminMode');
          }
          
          // Always check onboarding status for client portal regardless of user type
          await checkOnboardingStatus(session.user.id);
        }
      } else {
        // No session, make sure we're in the correct flow for login
        localStorage.setItem('portalContext', portalType);
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
  }, [navigate, isAdminMode, toast, checkOnboardingStatus, checkIsAdmin, setSession, setUser, setLoading, setIsAdmin, portalType]);
};
