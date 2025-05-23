
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <Input
        id="forgot-email"
        name="email"
        type="email"
        value={email}
        onChange={onChange}
        placeholder="Registered email address"
        required
        className="border-0 border-b border-gray-200 rounded-none px-0 py-3 focus:ring-0 font-light"
      />

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
