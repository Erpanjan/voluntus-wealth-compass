
import { ReactNode } from 'react';

export interface GoalType {
  id: string;
  name: string;
  interestLevel: string;
  isCustom?: boolean;
}

export interface GoalDetail {
  timeline?: string;
  riskAppetite?: string;
  riskTolerance?: string;
  marketResponse?: string;
}

export interface QuestionnaireState {
  answers: Record<string, any>;
  currentGoalIndex: number;
  updateAnswer: (questionId: string, value: any) => void;
  getSelectedGoals: () => GoalType[];
  currentGoal: GoalType | null;
  handleGoalQuestionComplete: () => void;
  isLoading: boolean;
  saveProgress: () => Promise<boolean>;
  isSaving: boolean;
}

export interface QuestionnaireResponseData {
  id: string;
  user_id: string;
  completed?: boolean;
  investment_goals?: string;
  risk_tolerance?: string;
  time_horizon?: string;
  additional_info?: string;
  age_group?: string;
  income_level?: string;
  net_worth?: string;
  investment_knowledge?: string;
  investment_experience?: string;
  complex_products?: number;
  investment_composition?: string;
  behavioral_biases?: string;
  answers_json?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireProviderProps {
  children: ReactNode | ((contextValue: QuestionnaireState) => ReactNode);
  currentStep: number;
  setCurrentStep: (step: number) => void;
}
