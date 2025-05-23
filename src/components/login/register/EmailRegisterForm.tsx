
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

interface EmailRegisterFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isAdminMode?: boolean;
}

const EmailRegisterForm: React.FC<EmailRegisterFormProps> = ({ 
  isSubmitting, 
  setIsSubmitting,
  isAdminMode = false
}) => {
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Clear any potentially leftover localStorage flags first
      clearUserStateFlags();
      
      // Handle registration with Supabase via email
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) throw error;
      
      // Clear user-specific flags if we have a user ID
      if (data?.user?.id) {
        clearUserStateFlags(data.user.id);
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error during registration. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          id="register-email"
          name="email"
          type="email"
          value={registerData.email}
          onChange={handleRegisterChange}
          placeholder="Email address"
          required
          className="border-0 border-b border-gray-200 rounded-none px-0 py-3 focus:ring-0 font-light"
        />
        
        <div className="relative">
          <Input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleRegisterChange}
            placeholder="Password"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-3 pr-10 focus:ring-0 font-light"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="relative">
          <Input
            id="register-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            placeholder="Confirm password"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-3 pr-10 focus:ring-0 font-light"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {registerData.password && registerData.confirmPassword && 
              registerData.password === registerData.confirmPassword && (
                <Check size={18} className="text-green-500" />
              )
            }
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className="text-gray-400" />
              ) : (
                <Eye size={18} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className={`w-full ${isAdminMode ? 'bg-black' : 'bg-black/80'} hover:bg-black text-white font-normal py-6 rounded-none`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : isAdminMode ? 'Register Admin' : 'Register'}
      </Button>
    </form>
  );
};

export default EmailRegisterForm;
