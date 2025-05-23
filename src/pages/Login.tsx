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
  const { loading, handleRegularLogin } = useAuth(isAdminMode);
  
  // Check if user is already authenticated and redirect if needed - optimized with proper dependencies
  useEffect(() => {
    if (loading) return; // Skip check if still loading
    
    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Not logged in, stay on login page
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
          }
        } else {
          // Regular user already authenticated, defer to useAuth for routing decision
          await handleRegularLogin();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear any potentially corrupted session data
        clearUserStateFlags();
      }
    };
    
    checkExistingAuth();
  }, [loading, isAdminMode, navigate, toast, handleRegularLogin]);
  
  // Enhanced fade-in animation when component loads - improved timing
  useEffect(() => {
    // Remove login-transition class from body if present
    document.body.classList.remove('login-transition');
    
    // Clear URL parameters when landing on login page
    if (location.search) {
      navigate('/login', { replace: true });
    }
    
    // Reduced delay for faster loading perception
    setPageLoaded(true);
  }, [navigate, location]);

  // Handle toggle animation for mode switch - optimized
  const handleAdminToggle = (checked: boolean) => {
    setIsAnimating(true);
    setIsAdminMode(checked);
    
    // Reduced animation time for better UX
    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  };

  // Show loading state with improved visualization
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-t-transparent text-gray-600 mb-2"></div>
          <p className="text-gray-600">Connecting to portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white py-8 px-4 transition-all duration-300 ease-in-out ${
      pageLoaded ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-[0.98]'
    }`}>
      <div className="max-w-md w-full mx-auto bg-white overflow-hidden flex flex-col" style={{ marginTop: '600px' }}>
        {/* Container with fixed positioning from top */}
        <div className="relative">
          {/* Title and admin mode toggle */}
          <div className="h-16 flex items-center justify-center mb-8">
            <AdminToggle 
              isAdminMode={isAdminMode}
              onToggle={handleAdminToggle}
              isAnimating={isAnimating}
            />
          </div>

          {/* Tabs container */}
          <div className="w-full">
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
