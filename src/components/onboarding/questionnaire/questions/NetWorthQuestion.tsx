
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface NetWorthQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const NetWorthQuestion: React.FC<NetWorthQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">3. What is your total personal net worth (in HKD)?</h2>
            <p className="text-gray-600 text-sm">
              Including residential properties and operational business assets but includes cash deposits, stocks, bonds, insurance, 
              and physical asset investments, after deducting liabilities such as mortgage loans, credit card debt, etc.
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "below1.5m", label: "A. Below HKD 1,500,000" },
              { value: "1.5m-5m", label: "B. HKD 1,500,000 (inclusive) – HKD 5,000,000 (inclusive)" },
              { value: "5m-10m", label: "C. HKD 5,000,000 (exclusive) – HKD 10,000,000 (inclusive)" },
              { value: "10m-100m", label: "D. HKD 10,000,000 (exclusive) – HKD 100,000,000 (inclusive)" },
              { value: "above100m", label: "E. Above HKD 100,000,000" }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`networth-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`networth-${option.value}`} 
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

export default NetWorthQuestion;
