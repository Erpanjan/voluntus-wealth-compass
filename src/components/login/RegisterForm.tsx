
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    contactType: 'email',
    contact: '',
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
      // Simulating registration request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Let's complete your profile setup.",
        duration: 5000,
      });

      // Redirect to onboarding
      navigate('/onboarding');
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error registering your account. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contactType">Contact Type</Label>
        <select
          id="contactType"
          name="contactType"
          value={registerData.contactType}
          onChange={handleRegisterChange}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="email">Email</option>
          <option value="phone">Phone Number</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">
          {registerData.contactType === 'email' ? 'Email' : 'Phone Number'}
        </Label>
        <Input
          id="contact"
          name="contact"
          type={registerData.contactType === 'email' ? 'email' : 'tel'}
          value={registerData.contact}
          onChange={handleRegisterChange}
          placeholder={registerData.contactType === 'email' ? 'name@example.com' : '+852 XXXX XXXX'}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Input
            id="reg-password"
            name="password"
            type={showRegPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleRegisterChange}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowRegPassword(!showRegPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
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
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
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
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
