
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';
import { Goal } from '../types';

interface GoalRiskToleranceQuestionProps {
  questionNumber: number;
  goal: Goal;
  value: string;
  onChange: (value: string) => void;
}

const GoalRiskToleranceQuestion: React.FC<GoalRiskToleranceQuestionProps> = ({ 
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
              <h2 className="text-xl font-semibold">Risk Tolerance</h2>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5">{goal.icon}</div>
                <span className="text-gray-700">{goal.name}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
            What type of investment returns would you prefer for this goal?
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "stable", label: "Stable, predictable returns with minimal fluctuation" },
              { value: "balanced", label: "Balanced mix of stable and growth-oriented investments" },
              { value: "growth", label: "Growth-focused with acceptance of short-term volatility" },
              { value: "aggressive", label: "Maximum growth potential, tolerant of significant volatility" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`tolerance-${option.value}`} 
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={`tolerance-${option.value}`} 
                    className="block cursor-pointer"
                  >
                    {option.label}
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

export default GoalRiskToleranceQuestion;
