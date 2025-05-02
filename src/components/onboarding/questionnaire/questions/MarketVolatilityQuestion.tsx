
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. Behavioral Response to Market Volatility</h2>
            <p className="text-gray-600 text-sm">
              Imagine your investment portfolio drops by 20% in a short period due to market volatility. How would you respond?
            </p>
          </div>

          <RadioGroup 
            className="grid gap-3"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "sell", label: "A. Sell all investments to prevent further losses." },
              { value: "partial_sell", label: "B. Sell a portion of the investments to reduce exposure." },
              { value: "wait", label: "C. Hold all investments, anticipating a market rebound." },
              { value: "buy", label: "D. Invest additional funds to capitalize on lower prices." }
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value} 
                  id={`volatility-${option.value}`}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={`volatility-${option.value}`} 
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

export default MarketVolatilityQuestion;
