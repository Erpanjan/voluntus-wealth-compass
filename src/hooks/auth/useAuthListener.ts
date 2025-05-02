
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
          
          // For admin portal or if the user is trying to access admin pages
          if (portalType === 'admin' || isAdminMode) {
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
              // User is admin and in admin portal
              localStorage.setItem('isAdminMode', 'true');
              localStorage.setItem('portalContext', 'admin');
              setIsAdmin(true);
              navigate('/admin/dashboard');
            }
          } else {
            // Handle regular user flow in client portal
            localStorage.removeItem('isAdminMode');
            localStorage.setItem('portalContext', 'client');
            
            // Only check onboarding status in client portal context
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
        const adminMode = localStorage.getItem('isAdminMode') === 'true' || isAdminMode || currentPortalContext === 'admin';
        
        // In admin portal or admin mode - handle admin flow with priority
        if (portalType === 'admin' || adminMode) {
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
        // Client portal flow only when explicitly in client portal
        else if (portalType === 'client') {
          // If user is admin but in client context, show a message but continue with client flow
          if (isUserAdmin) {
            toast({
              title: "Admin Account Detected",
              description: "You are logged in with an admin account. You can access the admin portal.",
              duration: 5000,
            });
          }
          
          // Always do client flow for client portal
          localStorage.setItem('portalContext', 'client');
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
  }, [navigate, isAdminMode, toast, checkOnboardingStatus, checkIsAdmin, setSession, setUser, setLoading, setIsAdmin, portalType]);
};
