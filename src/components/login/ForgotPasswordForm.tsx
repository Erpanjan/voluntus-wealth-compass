
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone } from 'lucide-react';

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
      const { error } = await supabase.auth.verifyOtp({
        phone: forgotData.phone,
        token: verificationCode,
        type: 'sms',
        options: {
          password: newPassword,
        },
      });
      
      if (error) throw error;
      
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
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full bg-transparent mb-4">
          <TabsTrigger value="email" className="data-[state=active]:bg-gray-100">Email</TabsTrigger>
          <TabsTrigger value="phone" className="data-[state=active]:bg-gray-100">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleForgotSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-gray-600 font-light">Email Address</Label>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                value={forgotData.email}
                onChange={handleForgotChange}
                placeholder="Enter your registered email"
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
        </TabsContent>
        
        <TabsContent value="phone">
          {!verificationSent ? (
            <form onSubmit={handleForgotSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="forgot-phone" className="text-gray-600 font-light">Phone Number</Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="forgot-phone"
                    name="phone"
                    type="tel"
                    value={forgotData.phone}
                    onChange={handleForgotChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="border-0 border-b border-gray-200 rounded-none px-0 pl-7 py-2 focus:ring-0 font-light"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +[country code][number], e.g., +12345678901</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndReset} className="space-y-6">
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
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-600 font-light">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
              
              <Button 
                type="button"
                variant="link"
                onClick={() => setVerificationSent(false)}
                className="w-full"
              >
                Go Back
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForgotPasswordForm;
