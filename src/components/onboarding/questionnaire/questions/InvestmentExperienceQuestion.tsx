
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface InvestmentExperienceQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const InvestmentExperienceQuestion: React.FC<InvestmentExperienceQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">5. Investment Experience</h2>
            <p className="text-sm text-gray-600">
              How many years of experience do you have investing in stocks, mutual funds (excluding money market funds),
              forex, and other higher-risk financial products?
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "A", label: "A. No experience" },
              { value: "B", label: "B. Some experience, but less than 2 years" },
              { value: "C", label: "C. Between 2 years (inclusive) and 5 years (inclusive)" },
              { value: "D", label: "D. Between 5 years (inclusive) and 8 years (inclusive)" },
              { value: "E", label: "E. More than 8 years (exclusive)" }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`experience-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`experience-${option.value}`} 
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

export default InvestmentExperienceQuestion;
