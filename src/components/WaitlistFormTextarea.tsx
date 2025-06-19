
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WaitlistFormTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
}

const WaitlistFormTextarea: React.FC<WaitlistFormTextareaProps> = ({
  id,
  name,
  value,
  onChange,
  label
}) => {
  return (
    <div className="w-full">
      <Label htmlFor={id} className="block text-sm font-medium text-[#666666] mb-1 font-poppins">
        {label}
      </Label>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=""
        className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] min-h-[80px] px-0 pb-3 pt-0 font-poppins resize-none focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
        style={{
          WebkitBoxShadow: '0 0 0 1000px transparent inset',
          WebkitTextFillColor: '#666666'
        }}
      />
    </div>
  );
};

export default WaitlistFormTextarea;
