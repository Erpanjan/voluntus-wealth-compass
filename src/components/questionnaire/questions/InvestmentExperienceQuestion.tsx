
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import QuestionCard from '../QuestionCard';

interface InvestmentExperienceQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const experienceLevels = [
  { value: 'none', label: 'No experience' },
  { value: 'less-than-2', label: 'Some experience, but less than 2 years' },
  { value: '2-5', label: 'Between 2 years (inclusive) and 5 years (inclusive)' },
  { value: '5-8', label: 'Between 5 years (inclusive) and 8 years (inclusive)' },
  { value: 'more-than-8', label: 'More than 8 years (exclusive)' },
];

const InvestmentExperienceQuestion: React.FC<InvestmentExperienceQuestionProps> = ({ value, onChange }) => {
  return (
    <QuestionCard question="How many years of experience do you have investing in stocks, mutual funds (excluding money market funds), forex, and other higher-risk financial products?">
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {experienceLevels.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`experience-${option.value}`} />
            <Label 
              htmlFor={`experience-${option.value}`}
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

export default InvestmentExperienceQuestion;
