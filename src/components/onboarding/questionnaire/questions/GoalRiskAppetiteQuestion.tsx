
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';
import { Goal } from '../types';

interface GoalRiskAppetiteQuestionProps {
  questionNumber: number;
  goal: Goal;
  value: string;
  onChange: (value: string) => void;
}

const GoalRiskAppetiteQuestion: React.FC<GoalRiskAppetiteQuestionProps> = ({ 
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
              <h2 className="text-xl font-semibold">Risk Appetite</h2>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5">{goal.icon}</div>
                <span className="text-gray-700">{goal.name}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
            How much risk are you willing to take to achieve this financial goal?
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "conservative", label: "Conservative - Prioritize capital preservation with minimal risk" },
              { value: "moderate", label: "Moderate - Balance between growth and capital preservation" },
              { value: "aggressive", label: "Aggressive - Maximize growth potential, comfortable with volatility" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`risk-${option.value}`} 
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={`risk-${option.value}`} 
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

export default GoalRiskAppetiteQuestion;
