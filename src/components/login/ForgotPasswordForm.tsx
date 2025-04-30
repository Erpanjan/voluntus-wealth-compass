
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordForm = () => {
  const [forgotData, setForgotData] = useState({
    contact: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleForgotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulating forgot password request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reset link sent",
        description: "If an account exists with this contact, you'll receive a password reset link.",
        duration: 5000,
      });

      // Reset form
      setForgotData({
        contact: '',
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error processing your request. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleForgotSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="forgot-contact" className="text-gray-600 font-light">Email or Phone Number</Label>
        <Input
          id="forgot-contact"
          name="contact"
          type="text"
          value={forgotData.contact}
          onChange={handleForgotChange}
          placeholder="Enter your registered email or phone"
          required
          className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
