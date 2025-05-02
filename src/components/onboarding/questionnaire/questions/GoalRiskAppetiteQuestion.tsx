
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. Risk Appetite</h2>
            <div className="flex items-center space-x-2 py-2 px-3 bg-amber-50 border border-amber-100 rounded-md">
              <div className="h-5 w-5 text-amber-600">{goal.icon}</div>
              <span className="font-medium text-amber-900">{goal.name}</span>
            </div>
            <p className="text-gray-600 text-sm">
              Which of the following best describes your risk appetite for the funds allocated to this goal?
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "conservative", label: "A. I am risk-averse, do not want to lose my principal, and prefer to achieve stable returns." },
              { value: "moderate", label: "B. I prefer to preserve my investments, do not want to lose my principal, but am willing to accept a certain level of income fluctuation." },
              { value: "growth", label: "C. I seek higher returns and growth for my capital, and am willing to accept limited losses to my principal." },
              { value: "aggressive", label: "D. I aim for high returns and am willing to bear relatively significant losses to my principal to achieve this." }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`risk-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`risk-${option.value}`} 
                  className="flex p-4 rounded-lg border border-gray-200 
                    cursor-pointer bg-white hover:bg-gray-50
                    peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:border-amber-300
                    peer-data-[state=checked]:text-amber-900"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalRiskAppetiteQuestion;
