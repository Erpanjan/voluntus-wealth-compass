
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. Absolute Risk Tolerance</h2>
            <div className="flex items-center space-x-2 py-2 px-3 bg-amber-50 border border-amber-100 rounded-md">
              <div className="h-5 w-5 text-amber-600">{goal.icon}</div>
              <span className="font-medium text-amber-900">{goal.name}</span>
            </div>
            <p className="text-gray-600 text-sm">
              Which of the following best describes the absolute loss you could tolerate for the funds prepared for this goal?
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "no_loss", label: "A. No loss of principal, but the returns fall short of expectations." },
              { value: "up_to_5", label: "B. Loss of principal up to 5% (inclusive)." },
              { value: "5_to_10", label: "C. Loss of principal between 5% (exclusive) and 10% (inclusive)." },
              { value: "10_to_15", label: "D. Loss of principal between 10% (exclusive) and 15% (inclusive)." },
              { value: "15_to_20", label: "E. Loss of principal between 15% (exclusive) and 20% (inclusive)." },
              { value: "above_30", label: "F. Loss of principal exceeding 30%." }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`tolerance-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`tolerance-${option.value}`} 
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

export default GoalRiskToleranceQuestion;
