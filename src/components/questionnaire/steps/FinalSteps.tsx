
import React from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import BehavioralBiasesQuestion from '../questions/BehavioralBiasesQuestion';
import ReviewSubmission from '../ReviewSubmission';

interface FinalStepsProps {
  step: number;
  onComplete: () => void;
}

const FinalSteps: React.FC<FinalStepsProps> = ({ step, onComplete }) => {
  const { answers, updateAnswer } = useQuestionnaire();
  
  // Map global step to local step
  const localStep = step - 14; // Steps 14-15 in the main flow

  switch (localStep) {
    case 0:
      return <BehavioralBiasesQuestion value={answers.behavioralBiases} onChange={(val) => updateAnswer('behavioralBiases', val)} />;
    case 1:
      return <ReviewSubmission answers={answers} onSubmit={onComplete} />;
    default:
      return null;
  }
};

export default FinalSteps;
