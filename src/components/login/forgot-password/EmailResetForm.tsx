
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailResetFormProps {
  email: string;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EmailResetForm: React.FC<EmailResetFormProps> = ({
  email,
  isSubmitting,
  onChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="forgot-email" className="text-gray-600 font-light">Email Address</Label>
        <Input
          id="forgot-email"
          name="email"
          type="email"
          value={email}
          onChange={onChange}
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
  );
};

export default EmailResetForm;
