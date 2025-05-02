import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RegisterFormProps {
  isAdminMode?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isAdminMode = false }) => {
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [registerData, setRegisterData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
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
      if (registerMethod === 'email') {
        // Handle registration with Supabase via email
        const { data, error } = await supabase.auth.signUp({
          email: registerData.email,
          password: registerData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          }
        });
        
        if (error) throw error;
        
        // Remove onboarding complete flag for new users
        localStorage.removeItem('onboardingComplete');
        
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
          duration: 5000,
        });
      } else {
        // Handle phone registration - first step is sending OTP
        const { data, error } = await supabase.auth.signUp({
          phone: registerData.phone,
          password: registerData.password,
        });
        
        if (error) throw error;
        
        // Remove onboarding complete flag for new users
        localStorage.removeItem('onboardingComplete');
        
        setVerificationSent(true);
        toast({
          title: "Verification code sent",
          description: "Please enter the code sent to your phone.",
          duration: 5000,
        });
      }
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Verify the OTP code for phone registration
      const { data, error } = await supabase.auth.verifyOtp({
        phone: registerData.phone,
        token: verificationCode,
        type: 'sms',
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification successful",
        description: "Your phone number has been verified. You can now log in.",
        duration: 5000,
      });
      
      // Reset the form
      setRegisterData({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      setVerificationCode('');
      setVerificationSent(false);
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
    <div className="space-y-6">
      <Tabs 
        defaultValue="email" 
        value={registerMethod} 
        onValueChange={(value) => setRegisterMethod(value as 'email' | 'phone')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full bg-transparent mb-4">
          <TabsTrigger value="email" className="data-[state=active]:bg-gray-100">Email</TabsTrigger>
          <TabsTrigger value="phone" className="data-[state=active]:bg-gray-100">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          {!verificationSent ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-gray-600 font-light">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Enter your email address"
                  required
                  className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-gray-600 font-light">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    required
                    className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
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
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-gray-600 font-light">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
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
                  
                  {registerData.password && registerData.confirmPassword && 
                    registerData.password === registerData.confirmPassword && (
                      <Check size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500" />
                    )
                  }
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
          ) : (
            <div className="text-center space-y-4 py-4">
              <p className="text-green-600">Registration email sent!</p>
              <p>Please check your email to verify your account.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="phone">
          {!verificationSent ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="register-phone" className="text-gray-600 font-light">Phone Number</Label>
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
                    className="border-0 border-b border-gray-200 rounded-none px-0 pl-7 py-2 focus:ring-0 font-light"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +[country code][number], e.g., +12345678901</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password-phone" className="text-gray-600 font-light">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password-phone"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    required
                    className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus:ring-0 font-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
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
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password-phone" className="text-gray-600 font-light">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password-phone"
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
                  
                  {registerData.password && registerData.confirmPassword && 
                    registerData.password === registerData.confirmPassword && (
                      <Check size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500" />
                    )
                  }
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Code...' : 'Send confirmation code'}
              </Button>
            </form>
          ) : (
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

export default RegisterForm;
