
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneVerificationFormProps {
  verificationCode: string;
  newPassword: string;
  isSubmitting: boolean;
  onVerificationCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoBack: () => void;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({
  verificationCode,
  newPassword,
  isSubmitting,
  onVerificationCodeChange,
  onPasswordChange,
  onSubmit,
  onGoBack
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="verification-code" className="text-gray-600 font-light">Verification Code</Label>
        <Input
          id="verification-code"
          type="text"
          value={verificationCode}
          onChange={onVerificationCodeChange}
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
          onChange={onPasswordChange}
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
        onClick={onGoBack}
        className="w-full"
      >
        Go Back
      </Button>
    </form>
  );
};

export default PhoneVerificationForm;
