
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PhoneVerificationFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  phone: string;
  onGoBack: () => void;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({ 
  isSubmitting, 
  setIsSubmitting, 
  phone, 
  onGoBack 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Verify the OTP code for phone registration
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: verificationCode,
        type: 'sms',
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification successful",
        description: "Your phone number has been verified. You can now log in.",
        duration: 5000,
      });
      
      // Reset the form by going back
      onGoBack();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleVerifyCode} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="verification-code" className="text-gray-600 font-light">Verification Code</Label>
        <Input
          id="verification-code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter code sent to your phone"
          required
          className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verifying...' : 'Verify Code'}
      </Button>
      
      <Button 
        type="button"
        variant="link"
        onClick={onGoBack}
        className="w-full"
      >
        Go Back
      </Button>
    </form>
  );
};

export default PhoneVerificationForm;
