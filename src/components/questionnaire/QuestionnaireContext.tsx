
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GoalType {
  id: string;
  name: string;
  interestLevel: string;
  isCustom?: boolean;
}

interface GoalDetail {
  timeline?: string;
  riskAppetite?: string;
  riskTolerance?: string;
  marketResponse?: string;
}

interface QuestionnaireState {
  answers: Record<string, any>;
  currentGoalIndex: number;
  updateAnswer: (questionId: string, value: any) => void;
  getSelectedGoals: () => GoalType[];
  currentGoal: GoalType | null;
  handleGoalQuestionComplete: () => void;
}

const QuestionnaireContext = createContext<QuestionnaireState | null>(null);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

interface QuestionnaireProviderProps {
  children: ReactNode;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({ 
  children, 
  currentStep, 
  setCurrentStep 
}) => {
  // State for storing all questionnaire answers
  const [answers, setAnswers] = useState<Record<string, any>>({
    goals: [], // Will store selected financial goals
    goalDetails: {} // Will store per-goal details
  });

  // State to track which goal we're currently asking about for questions 11-14
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  // Handle answer updates
  const updateAnswer = (questionId: string, value: any) => {
    console.log(`Updating ${questionId} with:`, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Function to get selected goals (used for goal-specific questions)
  const getSelectedGoals = () => {
    console.log("All goals:", answers.goals);
    const filteredGoals = answers.goals?.filter(goal => {
      const interestLevel = goal.interestLevel?.toLowerCase();
      console.log(`Goal: ${goal.name}, Interest Level: ${interestLevel}`);
      return (
        interestLevel === 'already-planned' || 
        interestLevel === 'strongly-interested' || 
        interestLevel === 'would-consider'
      );
    }) || [];
    
    console.log("Filtered goals:", filteredGoals);
    return filteredGoals;
  };
  
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

  const value = {
    answers,
    currentGoalIndex,
    updateAnswer,
    getSelectedGoals,
    currentGoal,
    handleGoalQuestionComplete
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
