
import React from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import AgeGroupQuestion from '../questions/AgeGroupQuestion';
import IncomeQuestion from '../questions/IncomeQuestion';
import NetWorthQuestion from '../questions/NetWorthQuestion';

interface BasicInfoStepsProps {
  step: number;
}

const BasicInfoSteps: React.FC<BasicInfoStepsProps> = ({ step }) => {
  const { answers, updateAnswer } = useQuestionnaire();

  switch (step) {
    case 0:
      return <AgeGroupQuestion value={answers.ageGroup} onChange={(val) => updateAnswer('ageGroup', val)} />;
    case 1:
      return <IncomeQuestion value={answers.income} onChange={(val) => updateAnswer('income', val)} />;
    case 2:
      return <NetWorthQuestion value={answers.netWorth} onChange={(val) => updateAnswer('netWorth', val)} />;
    default:
      return null;
  }
};

export default BasicInfoSteps;
