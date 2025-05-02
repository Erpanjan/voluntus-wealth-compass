
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

interface GoalRiskAppetiteQuestionProps {
  goal: GoalType;
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

const riskOptions = [
  { 
    value: 'risk-averse', 
    label: 'I am risk-averse, do not want to lose my principal, and prefer to achieve stable returns.' 
  },
  { 
    value: 'preserve', 
    label: 'I prefer to preserve my investments, do not want to lose my principal, but am willing to accept a certain level of income fluctuation.' 
  },
  { 
    value: 'growth', 
    label: 'I seek higher returns and growth for my capital, and am willing to accept limited losses to my principal.' 
  },
  { 
    value: 'high-returns', 
    label: 'I aim for high returns and am willing to bear relatively significant losses to my principal to achieve this.' 
  },
];

const GoalRiskAppetiteQuestion: React.FC<GoalRiskAppetiteQuestionProps> = ({ 
  goal, 
  value, 
  onChange, 
  onComplete 
}) => {
  return (
    <QuestionCard question={`Which of the following best describes your risk appetite for the funds allocated to ${goal.name}?`}>
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {riskOptions.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`risk-${option.value}`} className="mt-1" />
            <Label 
              htmlFor={`risk-${option.value}`}
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

export default GoalRiskAppetiteQuestion;
