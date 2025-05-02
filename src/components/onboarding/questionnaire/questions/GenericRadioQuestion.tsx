
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface RadioOption {
  value: string;
  label: string;
}

interface GenericRadioQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  gradientClass?: string;
}

const GenericRadioQuestion: React.FC<GenericRadioQuestionProps> = ({ 
  questionNumber, 
  title, 
  description, 
  options, 
  value, 
  onChange,
  gradientClass
}) => {
  const defaultGradient = getNumberedBackground(questionNumber);
  const gradient = gradientClass || defaultGradient;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${gradient} text-white flex items-center justify-center font-bold`}>{questionNumber}</div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {options.map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    `bg-gradient-to-r ${gradient.replace('bg-gradient-to-br', '')} text-white shadow-md` : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`option-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`option-${option.value}`} className="block cursor-pointer">
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

export default GenericRadioQuestion;
