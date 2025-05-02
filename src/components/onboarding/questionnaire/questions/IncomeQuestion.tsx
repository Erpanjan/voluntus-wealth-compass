
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface IncomeQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const IncomeQuestion: React.FC<IncomeQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">2. In the past three years, what is your average annual income range (in HKD)?</h2>
            <p className="text-gray-600 text-sm">
              Includes wages, salaries, business income, interest, financial asset income, rental income, and other non-financial asset income.
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "below100k", label: "A. Below HKD 100,000" },
              { value: "100k-200k", label: "B. HKD 100,000 (inclusive) – HKD 200,000 (exclusive)" },
              { value: "200k-500k", label: "C. HKD 200,000 (inclusive) – HKD 500,000 (inclusive)" },
              { value: "500k-1m", label: "D. HKD 500,000 (exclusive) – HKD 1,000,000 (inclusive)" },
              { value: "1m-2m", label: "E. HKD 1,000,000 (exclusive) – HKD 2,000,000 (inclusive)" },
              { value: "above2m", label: "F. Above HKD 2,000,000" }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`income-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`income-${option.value}`} 
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

export default IncomeQuestion;
