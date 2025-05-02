
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import QuestionCard from '../QuestionCard';

interface BehavioralBiasesQuestionProps {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}

const statements = [
  {
    id: 'sell_drop',
    text: 'I would sell an investment if it dropped 25% in value within the first six months, even if there is a chance it could recover in the future.'
  },
  {
    id: 'emotional_attachment',
    text: 'I tend to feel emotionally attached to my investments, making it difficult to part with them even if it's the rational choice.'
  },
  {
    id: 'maintain_investments',
    text: 'I prefer to maintain my existing investments rather than frequently buying and selling assets.'
  },
  {
    id: 'hesitate_sell',
    text: 'I would hesitate to sell a stock that I purchased at $50, even if it dropped to $40, hoping it will return to its original price.'
  },
  {
    id: 'mental_accounting',
    text: 'I tend to allocate my money into different categories based on specific financial goals rather than looking at my overall financial picture.'
  },
  {
    id: 'past_mistakes',
    text: 'Past investment mistakes strongly influence my current investment decisions, making me overly cautious about taking risks.'
  },
  {
    id: 'predictable_outcomes',
    text: 'I believe that investment outcomes are predictable if enough information is available.'
  },
  {
    id: 'profit_focus',
    text: 'The most important thing about my investments is that they make money, even if it means not following a structured plan.'
  },
  {
    id: 'value_alignment',
    text: 'I prefer to invest in companies that align with my personal values, such as environmental, social, or governance principles.'
  }
];

const BehavioralBiasesQuestion: React.FC<BehavioralBiasesQuestionProps> = ({ value = {}, onChange }) => {
  const [responses, setResponses] = useState<Record<string, number>>(
    value && Object.keys(value).length > 0 
      ? value 
      : statements.reduce((acc, statement) => ({ ...acc, [statement.id]: 3 }), {})
  );
  
  const handleSliderChange = (statementId: string, values: number[]) => {
    const updatedResponses = {
      ...responses,
      [statementId]: values[0]
    };
    
    setResponses(updatedResponses);
    onChange(updatedResponses);
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
      question="Respond to the following statements."
      description="Move the slider to indicate how much you agree or disagree with each statement."
    >
      <div className="space-y-10 pt-4">
        {statements.map((statement) => (
          <div key={statement.id} className="border rounded-lg p-5 space-y-6">
            <p className="font-medium">{statement.text}</p>
            <div className="w-full px-2">
              <Slider 
                defaultValue={[responses[statement.id] || 3]}
                min={1}
                max={5}
                step={1}
                onValueChange={(values) => handleSliderChange(statement.id, values)}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <div>Strongly Disagree</div>
                <div>Neutral</div>
                <div>Strongly Agree</div>
              </div>
            </div>
            <div className="text-center text-sm font-medium text-amber-600">
              Your response: {getLabelForValue(responses[statement.id] || 3)}
            </div>
          </div>
        ))}
      </div>
    </QuestionCard>
  );
};

export default BehavioralBiasesQuestion;
