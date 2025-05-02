
import { ReactNode } from 'react';

// Define a type for the behavioral biases object
export interface BehavioralBiases {
  sellOnDrop: number;
  emotionalAttachment: number;
  preferStability: number;
  hopefulRecovery: number;
  mentalAccounting: number;
  pastInfluence: number;
  predictability: number;
  profitOverPlan: number;
  valueAlignment: number;
}

// Define a type for the goal interest levels
export interface GoalInterestLevels {
  [goalId: string]: string;
}

// Define a type for the answers object
export interface QuestionnaireAnswers {
  // Basic Information
  ageGroup: string;
  incomeRange: string;
  netWorth: string;
  
  // Knowledge & Experience
  investmentKnowledge: string;
  investmentExperience: string;
  
  // Risk Assessment
  complexProducts: number;
  investmentComposition: number;
  
  // Goal-specific data
  goalInterestLevels: GoalInterestLevels;
  goalPriorities: string[];
  goalRiskPreferences: string[];
  goalHorizons: Record<string, string>;
  riskAppetite: Record<string, string>;
  absoluteRiskTolerance: Record<string, string>;
  
  // Behavioral
  marketVolatilityResponse: string;
  behavioralBiases: BehavioralBiases;
}

// Goal Financial Questionnaire
export interface Goal {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
  updateProgress: (percent: number) => void;
}
