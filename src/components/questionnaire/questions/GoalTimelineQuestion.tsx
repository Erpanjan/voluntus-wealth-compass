
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

interface GoalTimelineQuestionProps {
  goal: GoalType;
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

const timelineOptions = [
  { value: 'less-than-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1 to 3 years' },
  { value: '4-7', label: '4 to 7 years' },
  { value: '8-15', label: '8 to 15 years' },
  { value: 'more-than-15', label: 'More than 15 years' },
];

const GoalTimelineQuestion: React.FC<GoalTimelineQuestionProps> = ({ 
  goal, 
  value, 
  onChange, 
  onComplete 
}) => {
  const handleChange = (val: string) => {
    onChange(val);
  };

  return (
    <QuestionCard question={`What is the timeline for ${goal.name} to materialize?`}>
      <RadioGroup 
        value={value} 
        onValueChange={handleChange} 
        className="space-y-3"
      >
        {timelineOptions.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
            <Label 
              htmlFor={`timeline-${option.value}`}
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

export default GoalTimelineQuestion;
