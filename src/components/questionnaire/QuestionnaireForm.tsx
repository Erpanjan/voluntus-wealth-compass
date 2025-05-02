
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import AgeGroupQuestion from './questions/AgeGroupQuestion';
import IncomeQuestion from './questions/IncomeQuestion';
import NetWorthQuestion from './questions/NetWorthQuestion';
import InvestmentKnowledgeQuestion from './questions/InvestmentKnowledgeQuestion';
import InvestmentExperienceQuestion from './questions/InvestmentExperienceQuestion';
import ComplexProductsQuestion from './questions/ComplexProductsQuestion';
import InvestmentCompositionQuestion from './questions/InvestmentCompositionQuestion';
import FinancialGoalsQuestion from './questions/FinancialGoalsQuestion';
import GoalPrioritiesQuestion from './questions/GoalPrioritiesQuestion';
import RiskPreferencesQuestion from './questions/RiskPreferencesQuestion';
import GoalTimelineQuestion from './questions/GoalTimelineQuestion';
import GoalRiskAppetiteQuestion from './questions/GoalRiskAppetiteQuestion';
import GoalRiskToleranceQuestion from './questions/GoalRiskToleranceQuestion';
import GoalMarketResponseQuestion from './questions/GoalMarketResponseQuestion';
import BehavioralBiasesQuestion from './questions/BehavioralBiasesQuestion';
import ReviewSubmission from './ReviewSubmission';

interface QuestionnaireFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ 
  currentStep, 
  setCurrentStep,
  onComplete
}) => {
  // State for storing all questionnaire answers
  const [answers, setAnswers] = useState<Record<string, any>>({
    goals: [], // Will store selected financial goals
    goalDetails: {} // Will store per-goal details
  });

  // Handle answer updates
  const updateAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Function to get selected goals (used for goal-specific questions)
  const getSelectedGoals = () => {
    return answers.goals?.filter(goal => 
      goal.interestLevel === 'already-planned' || 
      goal.interestLevel === 'strongly-interested' || 
      goal.interestLevel === 'would-consider'
    ) || [];
  };

  // State to track which goal we're currently asking about for questions 11-14
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  
  // Get the current goal for goal-specific questions
  const selectedGoals = getSelectedGoals();
  const currentGoal = selectedGoals[currentGoalIndex] || null;

  // Function to progress to the next goal or step
  const handleGoalQuestionComplete = () => {
    if (currentGoalIndex < selectedGoals.length - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    } else {
      // Move to the next main step after all goals are processed
      setCurrentStep(currentStep + 1);
      setCurrentGoalIndex(0); // Reset for potential back navigation
    }
  };

  // Determine which component to render based on the current step
  const renderQuestion = () => {
    // For steps 11-14, we need to check if we have selected goals
    if (currentStep >= 10 && currentStep <= 13) {
      if (!selectedGoals.length) {
        // Skip goal-specific questions if no goals were selected
        setCurrentStep(14); // Skip to behavioral biases question
        return null;
      }
    }

    switch (currentStep) {
      case 0:
        return <AgeGroupQuestion value={answers.ageGroup} onChange={(val) => updateAnswer('ageGroup', val)} />;
      case 1:
        return <IncomeQuestion value={answers.income} onChange={(val) => updateAnswer('income', val)} />;
      case 2:
        return <NetWorthQuestion value={answers.netWorth} onChange={(val) => updateAnswer('netWorth', val)} />;
      case 3:
        return <InvestmentKnowledgeQuestion value={answers.investmentKnowledge} onChange={(val) => updateAnswer('investmentKnowledge', val)} />;
      case 4:
        return <InvestmentExperienceQuestion value={answers.investmentExperience} onChange={(val) => updateAnswer('investmentExperience', val)} />;
      case 5:
        return <ComplexProductsQuestion value={answers.complexProducts} onChange={(val) => updateAnswer('complexProducts', val)} />;
      case 6:
        return <InvestmentCompositionQuestion value={answers.investmentComposition} onChange={(val) => updateAnswer('investmentComposition', val)} />;
      case 7:
        return <FinancialGoalsQuestion value={answers.goals} onChange={(val) => updateAnswer('goals', val)} />;
      case 8:
        return selectedGoals.length > 0 ? 
          <GoalPrioritiesQuestion goals={selectedGoals} value={answers.goalPriorities} onChange={(val) => updateAnswer('goalPriorities', val)} /> : 
          <div className="py-4">
            <p className="text-center text-gray-600">No financial goals selected for prioritization. Let's continue.</p>
            <div className="flex justify-center mt-4">
              <button 
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue
              </button>
            </div>
          </div>;
      case 9:
        return selectedGoals.length > 0 ? 
          <RiskPreferencesQuestion goals={selectedGoals} value={answers.riskPreferences} onChange={(val) => updateAnswer('riskPreferences', val)} /> : 
          <div className="py-4">
            <p className="text-center text-gray-600">No financial goals selected for risk preferences. Let's continue.</p>
            <div className="flex justify-center mt-4">
              <button 
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue
              </button>
            </div>
          </div>;
      case 10:
        return currentGoal ? 
          <GoalTimelineQuestion 
            goal={currentGoal} 
            value={answers.goalDetails?.[currentGoal.id]?.timeline} 
            onChange={(val) => {
              setAnswers(prev => ({
                ...prev,
                goalDetails: {
                  ...prev.goalDetails,
                  [currentGoal.id]: {
                    ...prev.goalDetails?.[currentGoal.id],
                    timeline: val
                  }
                }
              }));
            }}
            onComplete={handleGoalQuestionComplete}
          /> : 
          null;
      case 11:
        return currentGoal ? 
          <GoalRiskAppetiteQuestion 
            goal={currentGoal}
            value={answers.goalDetails?.[currentGoal.id]?.riskAppetite}
            onChange={(val) => {
              setAnswers(prev => ({
                ...prev,
                goalDetails: {
                  ...prev.goalDetails,
                  [currentGoal.id]: {
                    ...prev.goalDetails?.[currentGoal.id],
                    riskAppetite: val
                  }
                }
              }));
            }}
            onComplete={handleGoalQuestionComplete}
          /> : 
          null;
      case 12:
        return currentGoal ? 
          <GoalRiskToleranceQuestion 
            goal={currentGoal}
            value={answers.goalDetails?.[currentGoal.id]?.riskTolerance}
            onChange={(val) => {
              setAnswers(prev => ({
                ...prev,
                goalDetails: {
                  ...prev.goalDetails,
                  [currentGoal.id]: {
                    ...prev.goalDetails?.[currentGoal.id],
                    riskTolerance: val
                  }
                }
              }));
            }}
            onComplete={handleGoalQuestionComplete}
          /> : 
          null;
      case 13:
        return currentGoal ? 
          <GoalMarketResponseQuestion 
            goal={currentGoal}
            riskTolerance={answers.goalDetails?.[currentGoal.id]?.riskTolerance}
            value={answers.goalDetails?.[currentGoal.id]?.marketResponse}
            onChange={(val) => {
              setAnswers(prev => ({
                ...prev,
                goalDetails: {
                  ...prev.goalDetails,
                  [currentGoal.id]: {
                    ...prev.goalDetails?.[currentGoal.id],
                    marketResponse: val
                  }
                }
              }));
            }}
            onComplete={handleGoalQuestionComplete}
          /> : 
          null;
      case 14:
        return <BehavioralBiasesQuestion value={answers.behavioralBiases} onChange={(val) => updateAnswer('behavioralBiases', val)} />;
      case 15:
        return <ReviewSubmission answers={answers} onSubmit={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={`question-${currentStep}-goal-${currentGoalIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="w-full">
        <CardContent className="p-6">
          {renderQuestion()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionnaireForm;
