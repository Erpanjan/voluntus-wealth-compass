
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = (isAdminMode: boolean) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
          
          // Check if the user is an admin by querying the profiles table
          if (isAdminMode) {
            const { data, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();
            
            if (error || !data?.is_admin) {
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
            navigate('/dashboard');
          }
        }
        setSession(session);
        setLoading(false);
      }
    );
    
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session);
      
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
        
        // Check localStorage for admin mode
        const adminMode = localStorage.getItem('isAdminMode') === 'true';
        
        if (adminMode || isAdminMode) {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
          
          setIsAdmin(data?.is_admin === true);
          
          if (data?.is_admin === true) {
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
              navigate('/dashboard');
            }
          }
        } else {
          navigate('/dashboard');
        }
      }
      
      setSession(session);
      setLoading(false);
    };
    
    checkSession();
    
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
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
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
      setIsAdmin(true);
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
    isAdmin,
    session,
    handleDemoLogin,
    handleRegularLogin
  };
};
