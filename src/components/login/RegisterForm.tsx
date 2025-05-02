
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailRegisterForm from '@/components/login/register/EmailRegisterForm';
import PhoneRegisterForm from '@/components/login/register/PhoneRegisterForm';
import PhoneVerificationForm from '@/components/login/register/PhoneVerificationForm';
import EmailSuccessMessage from '@/components/login/register/EmailSuccessMessage';

interface RegisterFormProps {
  isAdminMode?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isAdminMode = false }) => {
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Handle phone verification sent with phone number
  const handleVerificationSent = (phone: string) => {
    setPhoneNumber(phone);
    setVerificationSent(true);
  };

  // Handle going back from verification
  const handleGoBack = () => {
    setVerificationSent(false);
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
          {verificationSent ? (
            <EmailSuccessMessage />
          ) : (
            <EmailRegisterForm 
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              isAdminMode={isAdminMode}
            />
          )}
        </TabsContent>
        
        <TabsContent value="phone">
          {!verificationSent ? (
            <PhoneRegisterForm 
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onVerificationSent={handleVerificationSent}
            />
          ) : (
            <PhoneVerificationForm 
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              phone={phoneNumber}
              onGoBack={handleGoBack}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegisterForm;
