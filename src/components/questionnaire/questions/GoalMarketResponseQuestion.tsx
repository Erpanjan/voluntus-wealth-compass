
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

interface GoalMarketResponseQuestionProps {
  goal: GoalType;
  riskTolerance?: string;
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

const responseOptions = [
  { 
    value: 'sell-all', 
    label: 'Sell all investments to prevent further losses.' 
  },
  { 
    value: 'sell-portion', 
    label: 'Sell a portion of investments to reduce exposure.' 
  },
  { 
    value: 'hold-all', 
    label: 'Hold all investments, anticipating a market rebound.' 
  },
  { 
    value: 'invest-more', 
    label: 'Invest additional funds to capitalize on lower prices.' 
  },
];

const GoalMarketResponseQuestion: React.FC<GoalMarketResponseQuestionProps> = ({ 
  goal, 
  riskTolerance = 'up-to-5', 
  value, 
  onChange, 
  onComplete 
}) => {
  // Determine percentage drop based on risk tolerance
  const getDropPercentage = () => {
    switch (riskTolerance) {
      case 'no-loss': return '5%';
      case 'up-to-5': return '5%';
      case '5-10': return '10%';
      case '10-15': return '15%';
      case '15-20': return '20%';
      case 'above-30': return '30%';
      default: return '10%';
    }
  };

  const dropPercentage = getDropPercentage();

  return (
    <QuestionCard 
      question={`Imagine your investment portfolio drops by ${dropPercentage} in a short period due to market volatility for ${goal.name}. How would you respond?`}
    >
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-3"
      >
        {responseOptions.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`response-${option.value}`} />
            <Label 
              htmlFor={`response-${option.value}`}
              className="cursor-pointer flex-1"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={onComplete}>
          Continue to Next Goal
        </Button>
      </div>
    </QuestionCard>
  );
};

export default GoalMarketResponseQuestion;
