
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    contactType: 'email',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Determine if using email or phone for registration
      const contact = registerData.contactType === 'email' 
        ? { email: registerData.email } 
        : { phone: registerData.phone };
      
      // Attempt to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        ...contact,
        password: registerData.password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: registerData.contactType === 'email' 
          ? "Please check your email for a confirmation link."
          : "Please check your phone for a verification code.",
        duration: 5000,
      });

      // Redirect to onboarding
      navigate('/onboarding');
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error registering your account. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="contactType" className="text-gray-600 font-light">Contact Type</Label>
        <select
          id="contactType"
          name="contactType"
          value={registerData.contactType}
          onChange={handleRegisterChange}
          className="w-full border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light bg-transparent"
        >
          <option value="email">Email</option>
          <option value="phone">Phone Number</option>
        </select>
      </div>

      {registerData.contactType === 'email' ? (
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-600 font-light">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            placeholder="name@example.com"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-600 font-light">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={registerData.phone}
            onChange={handleRegisterChange}
            placeholder="+852 XXXX XXXX"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-gray-600 font-light">Password</Label>
        <div className="relative">
          <Input
            id="reg-password"
            name="password"
            type={showRegPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleRegisterChange}
            placeholder="••••••••"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
          />
          <button
            type="button"
            onClick={() => setShowRegPassword(!showRegPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2"
            tabIndex={-1}
          >
            {showRegPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-600 font-light">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            placeholder="••••••••"
            required
            className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2"
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

      <Button 
        type="submit" 
        className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
