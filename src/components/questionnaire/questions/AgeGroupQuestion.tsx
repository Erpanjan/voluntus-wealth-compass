
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import QuestionCard from '../QuestionCard';

interface AgeGroupQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const ageGroups = [
  { value: '18-25', label: '18–25 years old' },
  { value: '26-50', label: '26–50 years old' },
  { value: '51-60', label: '51–60 years old' },
  { value: '61-64', label: '61–64 years old' },
  { value: '65+', label: '65 years old or above' },
];

const AgeGroupQuestion: React.FC<AgeGroupQuestionProps> = ({ value, onChange }) => {
  return (
    <QuestionCard question="What is your age group?">
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {ageGroups.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`age-${option.value}`} />
            <Label 
              htmlFor={`age-${option.value}`}
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

export default AgeGroupQuestion;
