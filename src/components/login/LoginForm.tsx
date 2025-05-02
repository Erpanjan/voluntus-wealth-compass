
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

interface LoginFormProps {
  onDemoLogin: () => void;
  onRegularLogin?: () => void;
  isAdminMode?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onDemoLogin, onRegularLogin, isAdminMode = false }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting to sign in with:', loginData.email);
      
      // Clear any existing state flags before login
      clearUserStateFlags();
      
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (error) throw error;
      
      console.log('Login successful, session:', data.session);
      
      // Set authentication flag in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      if (isAdminMode) {
        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .single();
        
        if (adminError || !adminData) {
          console.error('Error or no admin data:', adminError);
          throw new Error('Your account does not have admin privileges');
        }
        
        // Set admin mode in localStorage if user is an admin
        localStorage.setItem('isAdminMode', 'true');
        
        toast({
          title: "Admin Login successful",
          description: "Welcome to the Admin Portal.",
          duration: 5000,
        });
        
        navigate('/admin/dashboard');
      } else {
        localStorage.removeItem('isAdminMode');
        
        toast({
          title: "Login successful",
          description: "Welcome to the Client Portal.",
          duration: 5000,
        });
        
        // Check onboarding status - this will handle navigation
        if (onRegularLogin) {
          onRegularLogin();
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Clear authentication flags on error
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-600 font-light">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={loginData.email}
          onChange={handleLoginChange}
          placeholder="Enter your email address"
          required
          className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-600 font-light">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="••••••••"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
      
      <div className="text-center">
        <Button 
          variant="link" 
          className="text-sm" 
          onClick={onDemoLogin}
          disabled={isSubmitting}
        >
          Try Demo {isAdminMode ? 'Admin' : 'Client'} Account
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
