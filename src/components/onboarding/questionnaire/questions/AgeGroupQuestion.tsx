
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface AgeGroupQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const AgeGroupQuestion: React.FC<AgeGroupQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">1. What is your age group?</h2>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "18-25", label: "A. 18–25 years old" },
              { value: "26-50", label: "B. 26–50 years old" },
              { value: "51-60", label: "C. 51–60 years old" },
              { value: "61-64", label: "D. 61–64 years old" },
              { value: "65+", label: "E. 65 years old or above" }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`age-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`age-${option.value}`} 
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

export default AgeGroupQuestion;
