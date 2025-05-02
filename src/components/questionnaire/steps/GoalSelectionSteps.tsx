
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuestionnaire } from '../QuestionnaireContext';
import FinancialGoalsQuestion from '../questions/FinancialGoalsQuestion';
import GoalPrioritiesQuestion from '../questions/GoalPrioritiesQuestion';
import RiskPreferencesQuestion from '../questions/RiskPreferencesQuestion';

interface GoalSelectionStepsProps {
  step: number;
  onNext: () => void;
}

const GoalSelectionSteps: React.FC<GoalSelectionStepsProps> = ({ step, onNext }) => {
  const { answers, updateAnswer, getSelectedGoals } = useQuestionnaire();
  
  // Map global step to local step
  const localStep = step - 7; // Steps 7-9 in the main flow
  const selectedGoals = getSelectedGoals();

  // Empty state UI to show when no goals are selected
  const NoGoalsSelected = () => (
    <div className="py-4">
      <p className="text-center text-gray-600">No financial goals selected. Let's continue.</p>
      <div className="flex justify-center mt-4">
        <Button onClick={onNext} className="px-4 py-2 bg-black text-white rounded-md">
          Continue
        </Button>
      </div>
    </div>
  );

  switch (localStep) {
    case 0:
      return <FinancialGoalsQuestion value={answers.goals} onChange={(val) => updateAnswer('goals', val)} />;
    case 1:
      return selectedGoals.length > 0 ? 
        <GoalPrioritiesQuestion goals={selectedGoals} value={answers.goalPriorities} onChange={(val) => updateAnswer('goalPriorities', val)} /> : 
        <NoGoalsSelected />;
    case 2:
      return selectedGoals.length > 0 ? 
        <RiskPreferencesQuestion goals={selectedGoals} value={answers.riskPreferences} onChange={(val) => updateAnswer('riskPreferences', val)} /> : 
        <NoGoalsSelected />;
    default:
      return null;
  }
};

export default GoalSelectionSteps;
