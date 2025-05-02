
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import QuestionCard from '../QuestionCard';

interface GoalType {
  id: string;
  name: string;
  interestLevel: string;
}

interface GoalRiskToleranceQuestionProps {
  goal: GoalType;
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

const toleranceOptions = [
  { 
    value: 'no-loss', 
    label: 'No loss of principal, but the returns fall short of expectations.' 
  },
  { 
    value: 'up-to-5', 
    label: 'Loss of principal up to 5% (inclusive).' 
  },
  { 
    value: '5-10', 
    label: 'Loss of principal between 5% (exclusive) and 10% (inclusive).' 
  },
  { 
    value: '10-15', 
    label: 'Loss of principal between 10% (exclusive) and 15% (inclusive).' 
  },
  { 
    value: '15-20', 
    label: 'Loss of principal between 15% (exclusive) and 20% (inclusive).' 
  },
  { 
    value: 'above-30', 
    label: 'Loss of principal exceeding 30%.' 
  },
];

const GoalRiskToleranceQuestion: React.FC<GoalRiskToleranceQuestionProps> = ({ 
  goal, 
  value, 
  onChange, 
  onComplete 
}) => {
  return (
    <QuestionCard question={`Which of the following best describes the absolute loss you could tolerate for the funds prepared for ${goal.name}?`}>
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {toleranceOptions.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`tolerance-${option.value}`} className="mt-1" />
            <Label 
              htmlFor={`tolerance-${option.value}`}
              className="cursor-pointer flex-1"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={onComplete}>
          Continue to Next Question
        </Button>
      </div>
    </QuestionCard>
  );
};

export default GoalRiskToleranceQuestion;
