
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Logo */}
        <div className="py-5 text-center mb-4">
          <Link to="/" className="inline-block mb-2">
            <div className="flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M120 40C100 70 80 140 60 170" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                <path d="M80 40C100 70 120 140 140 170" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                <circle cx="100" cy="170" r="5" fill="black"/>
              </svg>
              <div className="h-10 w-px bg-black mx-4"></div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-black">VOLUNTUS</span>
                <span className="text-xs tracking-wider leading-tight text-black">LONG-TERM CAPITAL</span>
              </div>
            </div>
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
