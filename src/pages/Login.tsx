
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
      // For demo accounts, direct to onboarding instead of dashboard
      navigate('/onboarding');
      
      toast({
        title: "Demo Account Activated",
        description: "Welcome to Voluntus! Please complete the onboarding process.",
        duration: 5000,
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header with Logo */}
        <div className="py-5 text-center mb-4">
          <Link to="/" className="inline-block mb-2">
            <img 
              src="/lovable-uploads/f02f35c5-3319-4467-ac99-5ee97c405c11.png" 
              alt="Voluntus" 
              className="h-24 mx-auto" 
            />
          </Link>
          <h1 className="text-lg font-medium">Client Portal</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="forgot">Reset Password</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="p-6">
            <LoginForm onDemoLogin={handleDemoLogin} />
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="p-6">
            <RegisterForm />
          </TabsContent>

          {/* Forgot Password Tab */}
          <TabsContent value="forgot" className="p-6">
            <ForgotPasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
