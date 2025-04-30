
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Import login components
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add fade-in animation when component loads
  useEffect(() => {
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
          navigate('/dashboard');
        }
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      }
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);

  // Handle demo account login
  const handleDemoLogin = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/onboarding');
      
      toast({
        title: "Demo Account Activated",
        description: "You are now using a demo account to explore the platform.",
        duration: 5000,
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  // Handle regular login success
  const handleRegularLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white py-12 px-4 transition-opacity duration-700 ease-in-out ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-md w-full bg-white overflow-hidden flex flex-col">
        {/* Fixed position header with title - adding consistent height */}
        <div className="h-24 flex items-center justify-center">
          <h1 className="text-3xl font-bold">Client Portal</h1>
        </div>

        {/* Fixed height tabs container */}
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
              />
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="p-6 transition-all duration-300 ease-in-out absolute w-full top-0 left-0">
              <RegisterForm />
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot" className="p-6 transition-all duration-300 ease-in-out absolute w-full top-0 left-0">
              <ForgotPasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
