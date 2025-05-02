
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface InvestmentExperienceQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const InvestmentExperienceQuestion: React.FC<InvestmentExperienceQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(5)} text-white flex items-center justify-center font-bold`}>5</div>
            <h2 className="text-xl font-semibold">Investment Experience</h2>
          </div>
          <p className="text-sm text-gray-600">
            How many years of experience do you have investing in stocks, mutual funds (excluding money market funds),
            forex, and other higher-risk financial products?
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "A", label: "No experience" },
              { value: "B", label: "Some experience, but less than 2 years" },
              { value: "C", label: "Between 2 years (inclusive) and 5 years (inclusive)" },
              { value: "D", label: "Between 5 years (inclusive) and 8 years (inclusive)" },
              { value: "E", label: "More than 8 years (exclusive)" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`experience-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`experience-${option.value}`} className="block cursor-pointer">
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

export default InvestmentExperienceQuestion;
