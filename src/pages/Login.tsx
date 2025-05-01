
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Import login components
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  // Check if user is already logged in
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, isAdminMode]);

  // Handle demo account login
  const handleDemoLogin = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
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
      
      setIsSubmitting(false);
    }, 1000);
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

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white py-12 px-4 transition-all duration-700 ease-in-out ${
      pageLoaded ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-[0.98]'
    }`}>
      <div className="max-w-md w-full bg-white overflow-hidden flex flex-col">
        {/* Title and admin mode toggle in the same row */}
        <div className="h-24 flex items-center justify-center relative">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">{isAdminMode ? 'Admin Portal' : 'Client Portal'}</h1>
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-mode"
                checked={isAdminMode}
                onCheckedChange={setIsAdminMode}
              />
              <Label htmlFor="admin-mode" className="text-sm text-gray-600">
                
              </Label>
            </div>
          </div>
        </div>

        {/* Conditional rendering based on admin mode */}
        {isAdminMode ? (
          /* Admin Portal - Login Only */
          <div className="p-6">
            <LoginForm 
              onDemoLogin={handleDemoLogin} 
              onRegularLogin={handleRegularLogin}
              isAdminMode={isAdminMode}
            />
          </div>
        ) : (
          /* Client Portal - Tabs with Login, Register, Reset Password */
          <Tabs defaultValue="login" className="w-full custom-tabs">
            <div className="px-6">
              <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12 relative">
                <TabsTrigger value="login" className="tab-button">Login</TabsTrigger>
                <TabsTrigger value="register" className="tab-button">Register</TabsTrigger>
                <TabsTrigger value="forgot" className="tab-button">Reset Password</TabsTrigger>
                <div className="tab-indicator"></div>
              </TabsList>
            </div>

            {/* Content container with fixed height to prevent layout shifts */}
            <div className="h-[450px] relative overflow-hidden">
              {/* Login Tab */}
              <TabsContent value="login" className="p-6 transition-all duration-300 ease-in-out absolute w-full top-0 left-0">
                <LoginForm 
                  onDemoLogin={handleDemoLogin} 
                  onRegularLogin={handleRegularLogin}
                  isAdminMode={isAdminMode}
                />
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="p-6 transition-all duration-300 ease-in-out absolute w-full top-0 left-0">
                <RegisterForm isAdminMode={isAdminMode} />
              </TabsContent>

              {/* Forgot Password Tab */}
              <TabsContent value="forgot" className="p-6 transition-all duration-300 ease-in-out absolute w-full top-0 left-0">
                <ForgotPasswordForm />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Login;
