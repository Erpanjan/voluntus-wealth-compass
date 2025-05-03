
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminToggle from '@/components/login/AdminToggle';
import LoginTabs from '@/components/login/LoginTabs';
import { useAuth } from '@/hooks/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

const Login = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the custom hook to handle authentication
  const { loading: authLoading, handleRegularLogin } = useAuth(isAdminMode);
  
  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    let isMounted = true;
    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Not logged in, stay on login page
          if (isMounted) {
            // Show page once we confirm not logged in
            setPageLoaded(true);
          }
          return;
        }
        
        // User is already authenticated, check if they're an admin in admin mode
        if (isAdminMode) {
          const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', session.user.id)
            .single();
            
          if (data && !error) {
            navigate('/admin/dashboard', { replace: true });
          } else {
            // Not an admin but trying to access admin mode
            toast({
              title: "Access Denied",
              description: "Your account does not have admin privileges.",
              variant: "destructive",
            });
            
            // Clear session since they don't have admin privileges
            await supabase.auth.signOut();
            clearUserStateFlags(session.user.id);
            
            if (isMounted) {
              // Show page after clearing sessions
              setPageLoaded(true);
            }
          }
        } else {
          // Regular user already authenticated, defer to useAuth for routing decision
          handleRegularLogin();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear any potentially corrupted session data
        clearUserStateFlags();
        
        if (isMounted) {
          // Show page even after error
          setPageLoaded(true);
        }
      }
    };
    
    if (!authLoading) {
      checkExistingAuth();
    } else {
      // If auth is still loading, we'll wait for it to complete
      // Don't show page yet
    }
    
    return () => {
      isMounted = false;
    };
  }, [authLoading, isAdminMode, navigate, toast, handleRegularLogin]);
  
  // Enhanced fade-in animation when component loads
  useEffect(() => {
    // Remove login-transition class from body if present
    document.body.classList.remove('login-transition');
    
    // Clear URL parameters when landing on login page
    if (location.search) {
      navigate('/login', { replace: true });
    }
    
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      if (!authLoading) {
        setPageLoaded(true);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [navigate, location, authLoading]);

  // Handle toggle animation for mode switch
  const handleAdminToggle = (checked: boolean) => {
    setIsAnimating(true);
    // Add animation class
    setTimeout(() => {
      setIsAdminMode(checked);
      // Remove animation class after mode has changed
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }, 25);
  };

  // Better loading state with improved UI
  if (authLoading && !pageLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4">
        <div className="animate-pulse flex flex-col items-center justify-center space-y-4 w-full max-w-md">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-[300px] w-full max-w-md bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white py-12 px-4 transition-all duration-700 ease-in-out ${
      pageLoaded ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-[0.98]'
    }`}>
      <div className="max-w-md w-full bg-white overflow-hidden flex flex-col">
        {/* Increased height container for better form display */}
        <div className="h-[700px] relative">
          {/* Title and admin mode toggle - fixed position */}
          <div className="h-20 flex items-center justify-center absolute top-0 left-0 w-full">
            <AdminToggle 
              isAdminMode={isAdminMode}
              onToggle={handleAdminToggle}
              isAnimating={isAnimating}
            />
          </div>

          {/* Tabs container with fixed position and increased space */}
          <div className="absolute top-20 left-0 w-full">
            <LoginTabs 
              isAdminMode={isAdminMode}
              isAnimating={isAnimating}
              onRegularLogin={handleRegularLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
