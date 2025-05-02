
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getNumberedBackground, getLikertScale } from '../data';

interface SliderQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({ 
  questionNumber, 
  title, 
  description, 
  value, 
  onChange 
}) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(questionNumber)} text-white flex items-center justify-center font-bold`}>{questionNumber}</div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}

          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <Slider 
                value={[value]} 
                min={1} 
                max={5} 
                step={1} 
                onValueChange={(vals) => onChange(vals[0])} 
              />
              <div className="text-center font-medium mt-2">
                {getLikertScale(value)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SliderQuestion;
