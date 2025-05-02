
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { timeHorizonOptions } from '../data';
import { Goal } from '../types';

interface GoalTimeHorizonQuestionProps {
  questionNumber: number;
  goal: Goal;
  value: string;
  onChange: (value: string) => void;
}

const GoalTimeHorizonQuestion: React.FC<GoalTimeHorizonQuestionProps> = ({ 
  questionNumber, 
  goal, 
  value, 
  onChange 
}) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. Goal Time Horizon</h2>
            <div className="flex items-center space-x-2 py-2 px-3 bg-amber-50 border border-amber-100 rounded-md">
              <div className="h-5 w-5 text-amber-600">{goal.icon}</div>
              <span className="font-medium text-amber-900">{goal.name}</span>
            </div>
            <p className="text-gray-600 text-sm">
              What is your time horizon for achieving this financial goal?
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {timeHorizonOptions.map((option) => (
              <div key={option} className="relative">
                <RadioGroupItem
                  value={option} 
                  id={`horizon-${option.replace(/\s+/g, '-').toLowerCase()}`} 
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`horizon-${option.replace(/\s+/g, '-').toLowerCase()}`} 
                  className="flex p-4 rounded-lg border border-gray-200 
                    cursor-pointer bg-white hover:bg-gray-50
                    peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:border-amber-300
                    peer-data-[state=checked]:text-amber-900"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTimeHorizonQuestion;
