import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (error) throw error;
      
      // Set authentication flag in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set admin mode in localStorage if applicable
      if (isAdminMode) {
        localStorage.setItem('isAdminMode', 'true');
      } else {
        localStorage.removeItem('isAdminMode');
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back to ${isAdminMode ? 'Admin' : 'Client'} Portal.`,
        duration: 5000,
      });
      
      // Call the onRegularLogin prop if it exists
      if (onRegularLogin) {
        onRegularLogin();
      } else {
        // Redirect to admin dashboard or client dashboard based on mode
        navigate(isAdminMode ? '/admin/dashboard' : '/dashboard');
      }
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
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
