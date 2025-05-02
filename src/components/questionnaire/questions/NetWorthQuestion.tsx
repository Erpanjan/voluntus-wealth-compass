
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import QuestionCard from '../QuestionCard';

interface NetWorthQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const netWorthRanges = [
  { value: 'below-1.5m', label: 'Below HKD 1,500,000' },
  { value: '1.5m-5m', label: 'HKD 1,500,000 (inclusive) – HKD 5,000,000 (inclusive)' },
  { value: '5m-10m', label: 'HKD 5,000,000 (exclusive) – HKD 10,000,000 (inclusive)' },
  { value: '10m-100m', label: 'HKD 10,000,000 (exclusive) – HKD 100,000,000 (inclusive)' },
  { value: 'above-100m', label: 'Above HKD 100,000,000' },
];

const NetWorthQuestion: React.FC<NetWorthQuestionProps> = ({ value, onChange }) => {
  return (
    <QuestionCard question="What is your total personal net worth (converted into HKD)?">
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {netWorthRanges.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`networth-${option.value}`} />
            <Label 
              htmlFor={`networth-${option.value}`}
              className="cursor-pointer flex-1"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </QuestionCard>
  );
};

export default NetWorthQuestion;
