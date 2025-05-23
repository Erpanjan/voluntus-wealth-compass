
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PhoneRegisterFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onVerificationSent: (phoneNumber: string) => void;
}

const PhoneRegisterForm: React.FC<PhoneRegisterFormProps> = ({ 
  isSubmitting, 
  setIsSubmitting, 
  onVerificationSent 
}) => {
  const [registerData, setRegisterData] = useState({
    phone: '',
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
      // Handle phone registration - first step is sending OTP
      const { data, error } = await supabase.auth.signUp({
        phone: registerData.phone,
        password: registerData.password,
      });
      
      if (error) throw error;
      
      // Remove onboarding complete flag for new users
      localStorage.removeItem('onboardingComplete');
      
      // Pass the phone number back to parent component
      onVerificationSent(registerData.phone);
      
      toast({
        title: "Verification code sent",
        description: "Please enter the code sent to your phone.",
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
        <div className="relative">
          <Phone size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            id="register-phone"
            name="phone"
            type="tel"
            value={registerData.phone}
            onChange={handleRegisterChange}
            placeholder="+1 (555) 123-4567"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 pl-7 py-3 focus:ring-0 font-light"
          />
        </div>
        <p className="text-xs text-gray-500 -mt-2">Format: +[country code][number], e.g., +12345678901</p>
        
        <div className="relative">
          <Input
            id="register-password-phone"
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
            id="register-confirm-password-phone"
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
        className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending Code...' : 'Register'}
      </Button>
    </form>
  );
};

export default PhoneRegisterForm;
