
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    email: '',
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
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
        duration: 5000,
      });

      // Clear form
      setRegisterData({
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Redirect to verification page or onboarding
      navigate('/login');
      
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
