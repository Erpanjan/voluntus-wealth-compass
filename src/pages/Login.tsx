
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminToggle from '@/components/login/AdminToggle';
import LoginTabs from '@/components/login/LoginTabs';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);
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
    
    return () => {
      clearTimeout(timer);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Improved toggle handler with better animation control
  const handleAdminToggle = useCallback((checked: boolean) => {
    // Prevent rapid toggling
    if (isToggleDisabled || isAnimating) return;
    
    // Disable toggle during animation
    setIsToggleDisabled(true);
    setIsAnimating(true);
    
    // Clear any existing animation timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Start animation sequence with smoother timing
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAdminMode(checked);
      
      // Complete animation with a single timeout for stability
      animationTimeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false);
        
        // Add a small delay before allowing another toggle for stability
        animationTimeoutRef.current = window.setTimeout(() => {
          setIsToggleDisabled(false);
        }, 350); // Slightly longer cooldown for stability
      }, 450); // Sync with CSS transition duration
    }, 50);
  }, [isToggleDisabled, isAnimating]);

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
    <div 
      className={`min-h-screen flex items-center justify-center bg-white py-12 px-4 transition-all duration-700 ease-in-out ${
        pageLoaded ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-[0.98]'
      }`}
    >
      <div className="max-w-md w-full bg-white overflow-hidden flex flex-col">
        {/* Fixed height container with improved positioning */}
        <div className="h-[500px] relative prevent-flicker">
          {/* Title and admin mode toggle - fixed position */}
          <div className="h-24 flex items-center justify-center absolute top-0 left-0 w-full prevent-flicker">
            <AdminToggle 
              isAdminMode={isAdminMode}
              onToggle={handleAdminToggle}
              isAnimating={isAnimating}
              isDisabled={isToggleDisabled}
            />
          </div>

          {/* Tabs container with fixed position and size */}
          <div className="absolute top-24 left-0 w-full prevent-flicker">
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
