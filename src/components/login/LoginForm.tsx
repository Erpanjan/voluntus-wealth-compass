
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onDemoLogin: () => void;
  onRegularLogin?: () => void; // Make this prop optional to maintain backward compatibility
}

const LoginForm: React.FC<LoginFormProps> = ({ onDemoLogin, onRegularLogin }) => {
  const [loginData, setLoginData] = useState({
    accountName: '',
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
      // Simulating login request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set authentication flag in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome back to Voluntus Long-term Capital.",
        duration: 5000,
      });
      
      // Call the onRegularLogin prop if it exists
      if (onRegularLogin) {
        onRegularLogin();
      } else {
        // Redirect to dashboard if onRegularLogin is not provided
        navigate('/dashboard');
      }
      
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid account name or password. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          name="accountName"
          value={loginData.accountName}
          onChange={handleLoginChange}
          placeholder="Enter your account name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
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
        className="w-full" 
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
          Try Demo Account
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
