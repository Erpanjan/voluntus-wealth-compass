
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useQuestionnaire } from '../QuestionnaireContext';

export const QuestionnaireBehavioralSection: React.FC = () => {
  const { answers, getNumberedBackground, getLikertScale, updateNestedAnswer } = useQuestionnaire();

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(15)} text-white flex items-center justify-center font-bold`}>15</div>
            <h2 className="text-xl font-semibold">Behavioral Biases</h2>
          </div>
          
          <p className="text-gray-600 text-sm">
            Respond to the following statements using the slider to indicate your level of agreement.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {/* SellOnDrop */}
            <AccordionItem value="sellOnDrop" className="border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-sm">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Selling on a Drop</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {getLikertScale(answers.behavioralBiases.sellOnDrop)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    "I would sell an investment if it dropped 25% in value within the first six months, even if there is a chance it could recover in the future."
                  </p>
                  <Slider 
                    value={[answers.behavioralBiases.sellOnDrop]} 
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'sellOnDrop', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Emotional Attachment */}
            <AccordionItem value="emotionalAttachment" className="border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-sm">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Emotional Attachment</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {getLikertScale(answers.behavioralBiases.emotionalAttachment)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    "I tend to feel emotionally attached to my investments, making it difficult to part with them even if it's the rational choice."
                  </p>
                  <Slider 
                    value={[answers.behavioralBiases.emotionalAttachment]} 
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'emotionalAttachment', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Stability Preference */}
            <AccordionItem value="preferStability" className="border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-sm">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Stability Preference</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {getLikertScale(answers.behavioralBiases.preferStability)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    "I prefer to maintain my existing investments rather than frequently buying and selling assets."
                  </p>
                  <Slider 
                    value={[answers.behavioralBiases.preferStability]} 
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'preferStability', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Additional accordion items for other behavioral questions */}
            {/* Items omitted for brevity, but would follow the same pattern */}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};
