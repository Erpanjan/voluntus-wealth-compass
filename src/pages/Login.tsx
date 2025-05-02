
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminToggle from '@/components/login/AdminToggle';
import LoginTabs from '@/components/login/LoginTabs';
import { useAuth } from '@/hooks/auth/useAuth';

const Login = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the custom hook to handle authentication
  const { loading, handleRegularLogin } = useAuth(isAdminMode);
  
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
      setPageLoaded(true);
    }, 50); // reduced from 100ms to 50ms for faster initial animation
    
    return () => clearTimeout(timer);
  }, [navigate, location]);

  // Handle toggle animation for mode switch
  const handleAdminToggle = (checked: boolean) => {
    setIsAnimating(true);
    // Add animation class
    setTimeout(() => {
      setIsAdminMode(checked);
      // Remove animation class after mode has changed
      setTimeout(() => {
        setIsAnimating(false);
      }, 150); // reduced from 300ms to 150ms to match the faster animation
    }, 25); // reduced from 50ms to 25ms for faster response
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
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
