
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';
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
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(questionNumber)} text-white flex items-center justify-center font-bold`}>{questionNumber}</div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Goal Time Horizon</h2>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5">{goal.icon}</div>
                <span className="text-gray-700">{goal.name}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
            What is your time horizon for achieving this financial goal?
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {timeHorizonOptions.map((option) => (
              <div key={option}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option ? 
                    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option} 
                    id={`horizon-${option.replace(/\s+/g, '-').toLowerCase()}`} 
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={`horizon-${option.replace(/\s+/g, '-').toLowerCase()}`} 
                    className="block cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTimeHorizonQuestion;
