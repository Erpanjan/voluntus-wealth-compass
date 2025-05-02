
import React from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import InvestmentKnowledgeQuestion from '../questions/InvestmentKnowledgeQuestion';
import InvestmentExperienceQuestion from '../questions/InvestmentExperienceQuestion';
import ComplexProductsQuestion from '../questions/ComplexProductsQuestion';
import InvestmentCompositionQuestion from '../questions/InvestmentCompositionQuestion';

interface InvestmentStepsProps {
  step: number;
}

const InvestmentSteps: React.FC<InvestmentStepsProps> = ({ step }) => {
  const { answers, updateAnswer } = useQuestionnaire();
  
  // Map global step to local step
  const localStep = step - 3; // Steps 3-6 in the main flow

  switch (localStep) {
    case 0:
      return <InvestmentKnowledgeQuestion value={answers.investmentKnowledge} onChange={(val) => updateAnswer('investmentKnowledge', val)} />;
    case 1:
      return <InvestmentExperienceQuestion value={answers.investmentExperience} onChange={(val) => updateAnswer('investmentExperience', val)} />;
    case 2:
      return <ComplexProductsQuestion value={answers.complexProducts} onChange={(val) => updateAnswer('complexProducts', val)} />;
    case 3:
      return <InvestmentCompositionQuestion value={answers.investmentComposition} onChange={(val) => updateAnswer('investmentComposition', val)} />;
    default:
      return null;
  }
};

export default InvestmentSteps;
