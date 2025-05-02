
import React from 'react';
import { Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readableFormat?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  readableFormat
}) => {
  return (
    <div className="flex-1">
      <label className="text-sm font-medium mb-1 block">{label} (24h format)</label>
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={value}
          onChange={onChange}
          className="pl-10"
          placeholder="HH:MM (e.g. 09:00)"
        />
      </div>
      {readableFormat && (
        <p className="text-xs text-gray-500 mt-1">{readableFormat}</p>
      )}
    </div>
  );
};

export default TimeInput;
