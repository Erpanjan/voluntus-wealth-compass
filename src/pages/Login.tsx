
import React, { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminToggle from '@/components/login/AdminToggle';
import LoginTabs from '@/components/login/LoginTabs';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const { toast } = useToast();
  
  // Use the custom hook to handle authentication
  const { loading, handleDemoLogin, handleRegularLogin } = useAuth(isAdminMode);
  
  // Enhanced fade-in animation when component loads
  useEffect(() => {
    // Remove login-transition class from body if present
    document.body.classList.remove('login-transition');
    
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Debounced toggle handler with animation safeguards
  const handleAdminToggle = useCallback((checked: boolean) => {
    // Prevent rapid toggling
    if (isToggleDisabled) return;
    
    // Disable toggle during animation
    setIsToggleDisabled(true);
    setIsAnimating(true);
    
    // Start animation sequence
    setTimeout(() => {
      setIsAdminMode(checked);
      
      // Complete animation and re-enable toggle with a safety buffer
      setTimeout(() => {
        setIsAnimating(false);
        // Add a small delay before allowing another toggle
        setTimeout(() => {
          setIsToggleDisabled(false);
        }, 300);
      }, 500);
    }, 50);
  }, [isToggleDisabled]);

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
        {/* Fixed height container for consistent positioning */}
        <div className="h-[500px] relative">
          {/* Title and admin mode toggle - fixed position */}
          <div className="h-24 flex items-center justify-center absolute top-0 left-0 w-full">
            <AdminToggle 
              isAdminMode={isAdminMode}
              onToggle={handleAdminToggle}
              isAnimating={isAnimating}
              isDisabled={isToggleDisabled}
            />
          </div>

          {/* Tabs container with fixed position and size */}
          <div className="absolute top-24 left-0 w-full">
            <LoginTabs 
              isAdminMode={isAdminMode}
              isAnimating={isAnimating}
              onDemoLogin={handleDemoLogin}
              onRegularLogin={handleRegularLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
