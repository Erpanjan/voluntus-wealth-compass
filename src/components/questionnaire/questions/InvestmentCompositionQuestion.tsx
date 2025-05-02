
import React from 'react';
import { Slider } from '@/components/ui/slider';
import QuestionCard from '../QuestionCard';

interface InvestmentCompositionQuestionProps {
  value: number;
  onChange: (value: number) => void;
}

const InvestmentCompositionQuestion: React.FC<InvestmentCompositionQuestionProps> = ({ value, onChange }) => {
  const sliderValue = value !== undefined ? [value] : [3]; // Default to 3 (Neutral)
  
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getLabelForValue = (val: number) => {
    switch(val) {
      case 1: return 'Strongly Disagree';
      case 2: return 'Disagree';
      case 3: return 'Neutral';
      case 4: return 'Agree';
      case 5: return 'Strongly Agree';
      default: return 'Neutral';
    }
  };

  return (
    <QuestionCard 
      question="My current portfolio includes significant investments in a single asset class (e.g., stocks, bonds) or specific products (e.g., real estate, cryptocurrencies)."
    >
      <div className="mt-6 space-y-8">
        <div className="w-full px-2">
          <Slider 
            defaultValue={sliderValue}
            min={1}
            max={5}
            step={1}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <div>Strongly Disagree</div>
            <div>Neutral</div>
            <div>Strongly Agree</div>
          </div>
        </div>
        <div className="text-center text-lg font-medium">
          Your selection: <span className="text-amber-600">{getLabelForValue(sliderValue[0])}</span>
        </div>
      </div>
    </QuestionCard>
  );
};

export default InvestmentCompositionQuestion;
