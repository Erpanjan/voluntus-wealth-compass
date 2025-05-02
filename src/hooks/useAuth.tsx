
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

  // Helper function to get user-specific localStorage key
  const getUserStorageKey = (userId: string, key: string) => {
    return `user_${userId}_${key}`;
  };
  
  // Helper function to check onboarding data status and redirect accordingly
  const checkOnboardingStatus = async (userId: string) => {
    try {
      console.log('Checking onboarding status for user:', userId);
      
      // First check database for onboarding data - prioritize this over localStorage
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('id, status, first_name, last_name, email, phone')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking onboarding data:', error);
        // If error, default to welcome page for safety
        navigate('/welcome');
        return;
      }
      
      console.log('Onboarding data found:', data);

      // Based on database onboarding data status
      if (data) {
        // Check if it's an empty draft (created by trigger but user never started onboarding)
        const isEmptyDraft = data.status === 'draft' && 
                            !data.first_name && 
                            !data.last_name && 
                            !data.email && 
                            !data.phone;
                            
        console.log('Is this an empty draft record?', isEmptyDraft);
        
        if (isEmptyDraft) {
          // It's a new user with an auto-created empty draft - send to welcome page
          localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
          navigate('/welcome');
        } else if (data.status === 'draft') {
          // User has draft data but hasn't submitted it yet, go to onboarding
          localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
          navigate('/onboarding');
        } else if (data.status === 'submitted') {
          // Application is submitted, go to pending approval
          localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'true');
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
          navigate('/pending-approval');
        } else if (data.status === 'approved') {
          // Application is approved, go to dashboard
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'true');
          navigate('/dashboard');
        }
      } else {
        // No onboarding data found, direct to welcome page
        console.log('No onboarding data found, directing to welcome page');
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        navigate('/welcome');
      }
    } catch (err) {
      console.error('Unexpected error in checkOnboardingStatus:', err);
      navigate('/welcome');
    }
  };

  // Clear localStorage keys for a specific user
  const clearUserStateFlags = (userId: string) => {
    if (!userId) return;
    
    localStorage.removeItem(getUserStorageKey(userId, 'onboardingComplete'));
    localStorage.removeItem(getUserStorageKey(userId, 'applicationSubmitted'));
    
    console.log(`Cleared all user state flags from localStorage for user ${userId}`);
  };

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
            
            // Handle regular user flow based on onboarding status
            if (event === 'SIGNED_IN') {
              await checkOnboardingStatus(session.user.id);
            }
          }
        }
        setSession(session);
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
      setLoading(false);
    };
    
    checkSession();
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, isAdminMode, toast]);

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
      // Demo users go directly to welcome page
      navigate('/welcome');
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
    handleRegularLogin,
    clearUserStateFlags
  };
};
