
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
  // Listen for auth state changes and check for existing session with optimized logic
  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener - more efficient event handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!isMounted) return;
        
        // Handle sign out event - optimized cleanup
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('isAdminMode');
            localStorage.removeItem('onboardingComplete');
            
            // Use requestAnimationFrame for smoother UI transition during navigation
            window.requestAnimationFrame(() => {
              navigate('/login');
            });
          }
          return;
        }
        
        // Handle sign in event - improved session handling
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check if trying to access admin portal with better deferred execution
          if (isAdminMode) {
            window.requestAnimationFrame(async () => {
              if (!isMounted) return;
              
              // Check admin status using admin_users table
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
                
                if (isMounted) {
                  setSession(null);
                  setUser(null);
                  setIsAdmin(false);
                  navigate('/login');
                }
              } else {
                // Set admin mode and navigate to admin dashboard
                localStorage.setItem('isAdminMode', 'true');
                
                if (isMounted) {
                  setIsAdmin(true);
                  setSession(session);
                  setUser(session.user);
                  setLoading(false);
                  navigate('/admin/dashboard');
                }
              }
            });
          } else {
            // Handle regular client flow with optimized state updates
            localStorage.removeItem('isAdminMode');
            
            if (isMounted) {
              setSession(session);
              setUser(session.user);
              
              window.requestAnimationFrame(async () => {
                if (!isMounted) return;
                setLoading(false);
                
                // Only proceed with onboarding status check for non-admin users on sign in
                if (event === 'SIGNED_IN') {
                  await checkOnboardingStatus(session.user.id);
                }
              });
            }
          }
        } else if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    );
    
    // Check for existing session with improved error handling
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (!isMounted) return;
        
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check localStorage for admin mode with optimized flow
          const adminMode = localStorage.getItem('isAdminMode') === 'true';
          
          if (adminMode || isAdminMode) {
            // Check if user is in admin_users table
            const isUserAdmin = await checkIsAdmin(session.user.id);
            
            if (isUserAdmin) {
              localStorage.setItem('isAdminMode', 'true');
              setIsAdmin(true);
              
              if (isMounted) {
                setSession(session);
                setUser(session.user);
                setLoading(false);
                
                if (window.location.pathname.startsWith('/admin')) {
                  // Already on admin page, no need to navigate
                  return;
                }
                
                navigate('/admin/dashboard');
              }
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
                
                if (isMounted) {
                  setSession(null);
                  setUser(null);
                  setLoading(false);
                  navigate('/login');
                }
              } else if (isMounted) {
                // Check onboarding status for regular users with optimized state management
                setSession(session);
                setUser(session.user);
                setLoading(false);
                await checkOnboardingStatus(session.user.id);
              }
            }
          } else if (isMounted) {
            // Check onboarding status for regular users with reduced state updates
            setSession(session);
            setUser(session.user);
            setLoading(false);
            await checkOnboardingStatus(session.user.id);
          }
        } else if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
          
          // If no session but trying to access protected routes, redirect to login
          const currentPath = window.location.pathname;
          const protectedRoutes = ['/welcome', '/onboarding', '/pending-approval', '/dashboard', '/questionnaire'];
          const isAdminRoute = currentPath.startsWith('/admin');
          
          if (protectedRoutes.includes(currentPath) || isAdminRoute) {
            navigate('/login');
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
    
    // Use a small timeout to allow the auth listener to set up first
    // This prevents potential race conditions
    const timer = setTimeout(() => {
      checkSession();
    }, 10);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, isAdminMode, toast, checkOnboardingStatus, checkIsAdmin, setSession, setUser, setLoading, setIsAdmin]);
};
