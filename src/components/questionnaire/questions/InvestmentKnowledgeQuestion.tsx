
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import QuestionCard from '../QuestionCard';

interface InvestmentKnowledgeQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const knowledgeLevels = [
  { 
    value: 'limited', 
    label: 'Apart from saving deposits, government bonds, and money market funds, I do not invest in other financial products. My investment knowledge is relatively limited.'
  },
  { 
    value: 'somewhat-limited', 
    label: 'Most of my investments are in savings deposits, government bonds, and money market funds, with limited investments in stocks, mutual funds, and riskier products. My investment knowledge is somewhat limited.'
  },
  { 
    value: 'certain-level', 
    label: 'My investments are diversified across savings, government bonds, trust products, stocks, and mutual funds. I have a certain level of investment knowledge.'
  },
  { 
    value: 'advanced', 
    label: 'Most of my investments are in stocks, mutual funds, forex, and other higher-risk products, with limited investments in savings, government bonds, and money market funds. I have advanced investment knowledge.'
  },
];

const InvestmentKnowledgeQuestion: React.FC<InvestmentKnowledgeQuestionProps> = ({ value, onChange }) => {
  return (
    <QuestionCard question="Which of the following best describes your investment knowledge and experience?">
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="space-y-4"
      >
        {knowledgeLevels.map((option) => (
          <div key={option.value} className="flex items-start space-x-2 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value={option.value} id={`knowledge-${option.value}`} className="mt-1" />
            <Label 
              htmlFor={`knowledge-${option.value}`}
              className="cursor-pointer flex-1"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </QuestionCard>
  );
};

export default InvestmentKnowledgeQuestion;
