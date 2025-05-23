import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailResetForm from './forgot-password/EmailResetForm';
import PhoneRequestForm from './forgot-password/PhoneRequestForm';
import PhoneVerificationForm from './forgot-password/PhoneVerificationForm';

const ForgotPasswordForm = () => {
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [forgotData, setForgotData] = useState({
    email: '',
    phone: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
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
      if (resetMethod === 'email') {
        // Send password reset email with Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(
          forgotData.email,
          {
            redirectTo: window.location.origin + '/reset-password',
          }
        );
        
        if (error) throw error;
        
        toast({
          title: "Reset link sent",
          description: "If an account exists with this email, you'll receive a password reset link.",
          duration: 5000,
        });

        // Reset form
        setForgotData({
          ...forgotData,
          email: '',
        });
      } else {
        // Send OTP to phone number
        const { error } = await supabase.auth.signInWithOtp({
          phone: forgotData.phone,
        });
        
        if (error) throw error;
        
        setVerificationSent(true);
        toast({
          title: "Verification code sent",
          description: "A code has been sent to your phone number.",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.message || "There was an error processing your request. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Verify the OTP and update the password
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: forgotData.phone,
        token: verificationCode,
        type: 'sms',
      });
      
      if (verifyError) throw verifyError;
      
      // Then update the password separately if verification succeeds
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
        duration: 5000,
      });
      
      // Reset form and state
      setForgotData({
        email: '',
        phone: '',
      });
      setVerificationCode('');
      setNewPassword('');
      setVerificationSent(false);
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "There was an error resetting your password. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="email" 
        value={resetMethod}
        onValueChange={(value) => setResetMethod(value as 'email' | 'phone')}
        className="w-full forgot-tabs"
      >
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <div className="relative min-h-[250px]">
          <TabsContent value="email">
            <EmailResetForm
              email={forgotData.email}
              isSubmitting={isSubmitting}
              onChange={handleForgotChange}
              onSubmit={handleForgotSubmit}
            />
          </TabsContent>
          
          <TabsContent value="phone">
            {!verificationSent ? (
              <PhoneRequestForm
                phone={forgotData.phone}
                isSubmitting={isSubmitting}
                onChange={handleForgotChange}
                onSubmit={handleForgotSubmit}
              />
            ) : (
              <PhoneVerificationForm
                verificationCode={verificationCode}
                newPassword={newPassword}
                isSubmitting={isSubmitting}
                onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
                onPasswordChange={(e) => setNewPassword(e.target.value)}
                onSubmit={handleVerifyAndReset}
                onGoBack={() => setVerificationSent(false)}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ForgotPasswordForm;
