
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface IncomeQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const IncomeQuestion: React.FC<IncomeQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(2)} text-white flex items-center justify-center font-bold`}>2</div>
            <h2 className="text-xl font-semibold">What is your average annual income range (in HKD)?</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Includes wages, salaries, business income, interest, financial asset income, rental income, and other non-financial asset income.
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "below100k", label: "Below HKD 100,000" },
              { value: "100k-200k", label: "HKD 100,000 (inclusive) – HKD 200,000 (exclusive)" },
              { value: "200k-500k", label: "HKD 200,000 (inclusive) – HKD 500,000 (inclusive)" },
              { value: "500k-1m", label: "HKD 500,000 (exclusive) – HKD 1,000,000 (inclusive)" },
              { value: "1m-2m", label: "HKD 1,000,000 (exclusive) – HKD 2,000,000 (inclusive)" },
              { value: "above2m", label: "Above HKD 2,000,000" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`income-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`income-${option.value}`} className="block cursor-pointer">
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

export default IncomeQuestion;
