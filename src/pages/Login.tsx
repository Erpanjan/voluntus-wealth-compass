
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

// Import login components
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          setSupabaseError(true);
          setLoading(false);
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setSupabaseError(true);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Show Supabase configuration error
  if (supabaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white flex-col p-8">
        <div className="max-w-md w-full bg-white p-8 border rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Supabase Configuration Error</h1>
          <p className="mb-4">
            Supabase environment variables are missing. Please check your configuration.
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
            <li>Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in the project root directory</li>
            <li>Add your Supabase URL and anon key:
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
                VITE_SUPABASE_URL=your-supabase-url{"\n"}
                VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
              </pre>
            </li>
            <li>Restart your development server</li>
          </ul>
          <Button 
            variant="outline" 
            onClick={handleDemoLogin}
            className="w-full"
          >
            Try Demo Account Instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
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
