
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useQuestionnaire } from '../QuestionnaireContext';

interface QuestionCardProps {
  questionNumber: number;
  title: string;
  description?: string;
  options: { value: string; label: string }[];
  answerKey: string;
  animationDelay?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  title,
  description,
  options,
  answerKey,
  animationDelay = 0.1
}) => {
  const { answers, updateAnswer, getNumberedBackground } = useQuestionnaire();
  const currentValue = answers[answerKey as keyof typeof answers] as string;

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(questionNumber)} text-white flex items-center justify-center font-bold`}>
              {questionNumber}
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>

          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}

          <RadioGroup 
            className="grid gap-4 pt-4"
            value={currentValue || ''} 
            onValueChange={(value) => updateAnswer(answerKey, value)}
          >
            {options.map((option, index) => (
              <motion.div 
                key={option.value} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * animationDelay }}
              >
                <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all transform hover:scale-102 ${
                  currentValue === option.value ? 
                    `bg-gradient-to-r ${getNumberedBackground(questionNumber)} text-white shadow-md` : 
                    'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${answerKey}-${option.value}`} 
                    className="sr-only"
                  />
                  <Label htmlFor={`${answerKey}-${option.value}`} className="block cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              </motion.div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
