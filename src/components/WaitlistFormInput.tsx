
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WaitlistFormInputProps {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
}

const WaitlistFormInput: React.FC<WaitlistFormInputProps> = ({
  id,
  name,
  type,
  required = false,
  value,
  onChange,
  label,
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Label htmlFor={id} className="block text-sm font-normal text-[#666666] mb-1 font-poppins">
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=""
        className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] h-11 sm:h-12 px-0 pb-3 pt-0 font-poppins font-light focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
        style={{
          WebkitBoxShadow: '0 0 0 1000px transparent inset',
          WebkitTextFillColor: '#666666'
        }}
      />
    </div>
  );
};

export default WaitlistFormInput;
