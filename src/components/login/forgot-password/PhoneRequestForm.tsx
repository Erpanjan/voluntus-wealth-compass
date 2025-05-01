
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

interface PhoneRequestFormProps {
  phone: string;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PhoneRequestForm: React.FC<PhoneRequestFormProps> = ({
  phone,
  isSubmitting,
  onChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="forgot-phone" className="text-gray-600 font-light">Phone Number</Label>
        <div className="relative">
          <Phone size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            id="forgot-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={onChange}
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
  );
};

export default PhoneRequestForm;
