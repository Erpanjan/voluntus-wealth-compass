
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import login components
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/dashboard');
    }
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
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-md w-full bg-white overflow-hidden flex flex-col">
        {/* Fixed position header with title */}
        <div className="py-8 text-center">
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

          {/* Fixed height container for tab content */}
          <div className="min-h-[400px]">
            {/* Login Tab */}
            <TabsContent value="login" className="p-6 transition-all duration-300 ease-in-out absolute w-full">
              <LoginForm 
                onDemoLogin={handleDemoLogin} 
                onRegularLogin={handleRegularLogin}
              />
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="p-6 transition-all duration-300 ease-in-out absolute w-full">
              <RegisterForm />
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot" className="p-6 transition-all duration-300 ease-in-out absolute w-full">
              <ForgotPasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
