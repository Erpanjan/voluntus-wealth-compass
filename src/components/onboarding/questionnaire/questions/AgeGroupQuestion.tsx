
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface AgeGroupQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const AgeGroupQuestion: React.FC<AgeGroupQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(1)} text-white flex items-center justify-center font-bold`}>1</div>
            <h2 className="text-xl font-semibold">What is your age group?</h2>
          </div>

          <RadioGroup 
            className="grid gap-4 pt-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "18-25", label: "18–25 years old" },
              { value: "26-50", label: "26–50 years old" },
              { value: "51-60", label: "51–60 years old" },
              { value: "61-64", label: "61–64 years old" },
              { value: "65+", label: "65 years old or above" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`age-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`age-${option.value}`} className="block cursor-pointer">
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

export default AgeGroupQuestion;
