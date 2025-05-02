
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface TimeInputProps {
  id: string;
  label: string;
  hourValue: string;
  minuteValue: string;
  periodValue: string;
  onHourChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinuteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPeriodChange: (value: string) => void;
  isValid: boolean | null;
}

const TimeInput: React.FC<TimeInputProps> = ({
  id,
  label,
  hourValue,
  minuteValue,
  periodValue,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  isValid
}) => {
  // Get border color based on validation state
  const getBorderColor = (isValid: boolean | null) => {
    if (isValid === null) return '';
    return isValid ? 'border-green-500' : 'border-red-500';
  };

  return (
    <div className="mb-4">
      <Label htmlFor={id} className="mb-2 block">{label}</Label>
      <div className="grid grid-cols-5 gap-2">
        {/* Hour Input */}
        <div className="col-span-1">
          <Label htmlFor={`${id}Hour`} className="sr-only">Hour</Label>
          <Input
            id={`${id}Hour`}
            type="text"
            placeholder="Hour"
            maxLength={2}
            value={hourValue}
            onChange={onHourChange}
            className={cn("text-center", getBorderColor(isValid))}
          />
        </div>
        
        <div className="col-span-1 flex items-center justify-center">
          <span className="text-gray-600">:</span>
        </div>
        
        {/* Minute Input */}
        <div className="col-span-1">
          <Label htmlFor={`${id}Minute`} className="sr-only">Minute</Label>
          <Input
            id={`${id}Minute`}
            type="text"
            placeholder="Min"
            maxLength={2}
            value={minuteValue}
            onChange={onMinuteChange}
            className={cn("text-center", getBorderColor(isValid))}
          />
        </div>
        
        {/* AM/PM Selector */}
        <div className="col-span-2">
          <Select 
            value={periodValue} 
            onValueChange={onPeriodChange}
          >
            <SelectTrigger className={getBorderColor(isValid)}>
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
