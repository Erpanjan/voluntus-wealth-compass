
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { getLikertScale } from '../data';

interface BehavioralBiasQuestionProps {
  questionNumber: number;
  title: string;
  description: string;
  biasKey: string;
  value: number;
  onChange: (value: number) => void;
}

const BehavioralBiasQuestion: React.FC<BehavioralBiasQuestionProps> = ({ 
  questionNumber, 
  title, 
  description, 
  biasKey, 
  value, 
  onChange 
}) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. {title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Strongly Disagree</span>
                <span className="text-sm text-gray-600">Strongly Agree</span>
              </div>
              <Slider 
                value={[value]} 
                min={1} 
                max={5} 
                step={1} 
                onValueChange={(vals) => onChange(vals[0])} 
                className="mt-2"
              />
              <div className="text-center font-medium mt-2 py-1 text-amber-900 bg-amber-50 border border-amber-100 rounded-md">
                {getLikertScale(value)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralBiasQuestion;
