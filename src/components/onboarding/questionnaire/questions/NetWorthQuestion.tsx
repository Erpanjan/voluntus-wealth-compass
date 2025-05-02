
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface NetWorthQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const NetWorthQuestion: React.FC<NetWorthQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(3)} text-white flex items-center justify-center font-bold`}>3</div>
            <h2 className="text-xl font-semibold">What is your total personal net worth (in HKD)?</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Including residential properties and operational business assets, cash deposits, stocks, bonds, insurance, 
            and physical asset investments, after deducting liabilities such as mortgage loans, credit card debt, etc.
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "below1.5m", label: "Below HKD 1,500,000" },
              { value: "1.5m-5m", label: "HKD 1,500,000 (inclusive) – HKD 5,000,000 (inclusive)" },
              { value: "5m-10m", label: "HKD 5,000,000 (exclusive) – HKD 10,000,000 (inclusive)" },
              { value: "10m-100m", label: "HKD 10,000,000 (exclusive) – HKD 100,000,000 (inclusive)" },
              { value: "above100m", label: "Above HKD 100,000,000" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`networth-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`networth-${option.value}`} className="block cursor-pointer">
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

export default NetWorthQuestion;
