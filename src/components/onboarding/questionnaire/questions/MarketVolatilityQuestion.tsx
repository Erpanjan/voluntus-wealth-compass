
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface MarketVolatilityQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}

const MarketVolatilityQuestion: React.FC<MarketVolatilityQuestionProps> = ({ 
  questionNumber, 
  value, 
  onChange 
}) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(questionNumber)} text-white flex items-center justify-center font-bold`}>{questionNumber}</div>
            <h2 className="text-xl font-semibold">Market Volatility Response</h2>
          </div>
          
          <p className="text-gray-600 text-sm">
            How would you respond if your investment portfolio suddenly dropped by 20% in value?
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "sell", label: "Sell immediately to prevent further losses" },
              { value: "partial_sell", label: "Sell a portion of the investments to reduce risk" },
              { value: "wait", label: "Wait and see before making any decisions" },
              { value: "hold", label: "Maintain the investments, expecting recovery over time" },
              { value: "buy", label: "Buy more while prices are low" }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`volatility-${option.value}`} 
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={`volatility-${option.value}`} 
                    className="block cursor-pointer"
                  >
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

export default MarketVolatilityQuestion;
