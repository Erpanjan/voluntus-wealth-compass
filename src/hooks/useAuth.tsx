
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = (isAdminMode: boolean) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check if the user is an admin by querying the profiles table
          if (isAdminMode) {
            checkIfAdmin(session.user.id).then(isAdmin => {
              if (isAdmin) {
                localStorage.setItem('isAdminMode', 'true');
                navigate('/admin/dashboard');
              } else {
                toast({
                  title: "Access Denied",
                  description: "Your account does not have admin privileges.",
                  variant: "destructive",
                  duration: 5000,
                });
                // Redirect to regular dashboard if not an admin
                localStorage.removeItem('isAdminMode');
                navigate('/dashboard');
              }
            });
          } else {
            localStorage.removeItem('isAdminMode');
            navigate('/dashboard');
          }
        }
        setSession(session);
        setLoading(false);
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
        
        // Check localStorage for admin mode
        const adminMode = localStorage.getItem('isAdminMode') === 'true';
        
        if (adminMode) {
          checkIfAdmin(session.user.id).then(isAdmin => {
            if (isAdmin) {
              navigate('/admin/dashboard');
            } else {
              // If not an admin but trying to access admin routes,
              // redirect to regular dashboard
              localStorage.removeItem('isAdminMode');
              navigate('/dashboard');
              toast({
                title: "Access Denied",
                description: "Your account does not have admin privileges.",
                variant: "destructive",
                duration: 5000,
              });
            }
          });
        } else {
          navigate('/dashboard');
        }
      }
      setSession(session);
      setLoading(false);
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, isAdminMode, toast]);

  // Function to check if a user is an admin
  const checkIfAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data?.is_admin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Handle demo account login
  const handleDemoLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    
    // Set admin mode in localStorage if toggle is on
    if (isAdminMode) {
      localStorage.setItem('isAdminMode', 'true');
      navigate('/admin/dashboard');
    } else {
      localStorage.removeItem('isAdminMode');
      navigate('/onboarding');
    }
    
    toast({
      title: isAdminMode ? "Admin Demo Account Activated" : "Demo Account Activated",
      description: isAdminMode 
        ? "You are now using a demo admin account to explore the admin portal." 
        : "You are now using a demo account to explore the platform.",
      duration: 5000,
    });
  };

  // Handle regular login success
  const handleRegularLogin = () => {
    // Navigation is already handled in the auth state change listener
  };

  return {
    loading,
    handleDemoLogin,
    handleRegularLogin
  };
};
