
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
          
          // Check if admin mode is enabled and set local storage
          if (isAdminMode) {
            localStorage.setItem('isAdminMode', 'true');
            navigate('/admin/dashboard');
          } else {
            localStorage.removeItem('isAdminMode');
            navigate('/dashboard');
          }
        }
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
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
      setLoading(false);
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, isAdminMode]);

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
    if (isAdminMode) {
      localStorage.setItem('isAdminMode', 'true');
      navigate('/admin/dashboard');
    } else {
      localStorage.removeItem('isAdminMode');
      navigate('/dashboard');
    }
  };

  return {
    loading,
    handleDemoLogin,
    handleRegularLogin
  };
};
