
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionnaireSectionProps {
  questionnaireData: {
    completed: boolean;
    answers: Record<string, any>;
  };
  updateQuestionnaireData: (data: { completed: boolean; answers: Record<string, any> }) => void;
  navigateToNext: () => void;
  navigateToPrev: () => void;
  handleSaveDraft: () => void;
}

const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({
  questionnaireData,
  updateQuestionnaireData,
  navigateToNext,
  navigateToPrev,
  handleSaveDraft
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
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      
      // Update parent component state
      updateQuestionnaireData({
        completed: isQuestionnaireComplete(newAnswers),
        answers: newAnswers
      });
      
      return newAnswers;
    });
  };

  const isQuestionnaireComplete = (currentAnswers: Record<string, any>) => {
    // In a real app, you might have more complex validation
    return questions.filter(q => q.type !== 'textarea').every(q => currentAnswers[q.id]);
  };

  const handleContinue = () => {
    updateQuestionnaireData({
      completed: isQuestionnaireComplete(answers),
      answers
    });
    navigateToNext();
  };

  return (
    <Section
      title="Financial Questionnaire"
      subtitle="Help us understand your financial goals and preferences. This information will help us provide better recommendations."
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-700">
            This questionnaire is optional but will help us tailor our advice to your specific situation.
            Your answers are confidential and will only be used to customize our recommendations.
          </p>
        </div>
        
        <div className="space-y-8">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3">
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
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={navigateToPrev}>
            Back
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default QuestionnaireSection;
