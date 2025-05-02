
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import QuestionCard from '../QuestionCard';

interface IncomeQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const incomeRanges = [
  { value: 'below-100k', label: 'Below HKD 100,000' },
  { value: '200k-500k', label: 'HKD 200,000 (inclusive) – HKD 500,000 (inclusive)' },
  { value: '500k-1m', label: 'HKD 500,000 (exclusive) – HKD 1,000,000 (inclusive)' },
  { value: '1m-2m', label: 'HKD 1,000,000 (exclusive) – HKD 2,000,000 (inclusive)' },
  { value: 'above-2m', label: 'Above HKD 2,000,000' },
];

const IncomeQuestion: React.FC<IncomeQuestionProps> = ({ value, onChange }) => {
  return (
    <QuestionCard question="In the past three years, what is your average annual income range (converted into HKD)?">
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {incomeRanges.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`income-${option.value}`} />
            <Label 
              htmlFor={`income-${option.value}`}
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

export default IncomeQuestion;
