
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionnaireFormSectionProps {
  questionnaireData: {
    completed: boolean;
    answers: Record<string, any>;
  };
  updateQuestionnaireData: (data: { completed: boolean; answers: Record<string, any> }) => void;
}

const QuestionnaireFormSection: React.FC<QuestionnaireFormSectionProps> = ({
  questionnaireData,
  updateQuestionnaireData
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>(questionnaireData.answers || {});

  // Sample questions - in a real app these might come from an API
  const questions = [
    {
      id: 'investmentGoals',
      question: 'What are your primary investment goals?',
      type: 'radio',
      options: [
        { value: 'retirement', label: 'Retirement Planning' },
        { value: 'wealth', label: 'Wealth Accumulation' },
        { value: 'income', label: 'Regular Income' },
        { value: 'education', label: 'Education Funding' },
        { value: 'other', label: 'Other Goals' }
      ]
    },
    {
      id: 'riskTolerance',
      question: 'How would you describe your risk tolerance?',
      type: 'radio',
      options: [
        { value: 'conservative', label: 'Conservative - Preserve capital with minimal risk' },
        { value: 'moderate', label: 'Moderate - Balance between growth and capital preservation' },
        { value: 'aggressive', label: 'Aggressive - Maximize growth, comfortable with volatility' }
      ]
    },
    {
      id: 'timeHorizon',
      question: 'What is your investment time horizon?',
      type: 'radio',
      options: [
        { value: 'short', label: 'Short term (1-3 years)' },
        { value: 'medium', label: 'Medium term (3-10 years)' },
        { value: 'long', label: 'Long term (10+ years)' }
      ]
    },
    {
      id: 'additionalInfo',
      question: 'Is there anything else about your financial situation we should know?',
      type: 'textarea'
    }
  ];

  const handleAnswerChange = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Update parent component state
    updateQuestionnaireData({
      completed: isQuestionnaireComplete(newAnswers),
      answers: newAnswers
    });
  };

  const isQuestionnaireComplete = (currentAnswers: Record<string, any>) => {
    // In a real app, you might have more complex validation
    return questions.filter(q => q.type !== 'textarea').every(q => currentAnswers[q.id]);
  };

  return (
    <div className="space-y-10">
      {questions.map((question) => (
        <div key={question.id} className="space-y-4">
          <h3 className="text-lg font-medium">{question.question}</h3>
          
          {question.type === 'radio' && question.options && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label 
                    htmlFor={`${question.id}-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.type === 'textarea' && (
            <Textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Your response (optional)"
              className="min-h-[100px]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionnaireFormSection;
