
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getNumberedBackground } from '../data';

interface InvestmentKnowledgeQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const InvestmentKnowledgeQuestion: React.FC<InvestmentKnowledgeQuestionProps> = ({ value, onChange }) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(4)} text-white flex items-center justify-center font-bold`}>4</div>
            <h2 className="text-xl font-semibold">Investment Knowledge and Experience</h2>
          </div>
          <p className="text-sm text-gray-600">
            Which of the following best describes your investment knowledge and experience?
          </p>

          <RadioGroup 
            className="grid gap-4"
            value={value} 
            onValueChange={onChange}
          >
            {[
              { value: "A", label: "Apart from saving deposits, government bonds, and money market funds, I do not invest in other financial products. My investment knowledge is relatively limited." },
              { value: "B", label: "Most of my investments are in savings deposits, government bonds, and money market funds, with limited investments in stocks, mutual funds, and riskier products. My investment knowledge is somewhat limited." },
              { value: "C", label: "My investments are diversified across savings, government bonds, trust products, stocks, and mutual funds. I have a certain level of investment knowledge." },
              { value: "D", label: "Most of my investments are in stocks, mutual funds, forex, and other higher-risk products, with limited investments in savings, government bonds, and money market funds. I have advanced investment knowledge." }
            ].map((option) => (
              <div key={option.value}>
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                  value === option.value ? 
                    'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-md' : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`knowledge-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`knowledge-${option.value}`} className="block cursor-pointer text-sm">
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

export default InvestmentKnowledgeQuestion;
