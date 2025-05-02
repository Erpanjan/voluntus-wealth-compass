
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define types
interface BehavioralBiases {
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

export interface QuestionnaireAnswers {
  // Basic Information
  ageGroup: string;
  incomeRange: string;
  netWorth: string;
  // Knowledge & Experience
  investmentKnowledge: string;
  investmentExperience: string;
  // Complex Products & Investment Composition
  complexProducts: number;
  investmentComposition: number;
  // Goal-specific answers
  riskAppetite: Record<string, string>;
  absoluteRiskTolerance: Record<string, string>;
  // Behavioral
  marketVolatilityResponse: string;
  behavioralBiases: BehavioralBiases;
}

interface FinancialGoal {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface QuestionnaireContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  answers: QuestionnaireAnswers;
  updateAnswer: (section: string, value: any) => void;
  updateNestedAnswer: (section: string, subsection: string, value: any) => void;
  financialGoals: FinancialGoal[];
  setFinancialGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
  selectedGoals: string[];
  setSelectedGoals: React.Dispatch<React.SetStateAction<string[]>>;
  currentGoalIndex: number;
  setCurrentGoalIndex: React.Dispatch<React.SetStateAction<number>>;
  achievementUnlocked: string | null;
  setAchievementUnlocked: React.Dispatch<React.SetStateAction<string | null>>;
  animateStep: boolean;
  setAnimateStep: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  updateGoalAnswer: (answerType: 'riskAppetite' | 'absoluteRiskTolerance', value: string) => void;
  handleGoalSelection: (goal: string, isChecked: boolean) => void;
  getLikertScale: (value: number) => string;
  getNumberedBackground: (questionNumber: number) => string;
}

// Create context with default values
const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// Define initial answers
const initialAnswers: QuestionnaireAnswers = {
  // Basic Information
  ageGroup: '',
  incomeRange: '',
  netWorth: '',
  // Knowledge & Experience
  investmentKnowledge: '',
  investmentExperience: '',
  // Complex Products & Investment Composition
  complexProducts: 3,
  investmentComposition: 3,
  // Goal-specific answers
  riskAppetite: {},
  absoluteRiskTolerance: {},
  // Behavioral
  marketVolatilityResponse: '',
  behavioralBiases: {
    sellOnDrop: 3,
    emotionalAttachment: 3,
    preferStability: 3,
    hopefulRecovery: 3,
    mentalAccounting: 3,
    pastInfluence: 3,
    predictability: 3,
    profitOverPlan: 3,
    valueAlignment: 3
  }
};

// Provider component
export const QuestionnaireProvider: React.FC<{
  children: React.ReactNode;
  setCompleted: (completed: boolean) => void;
}> = ({ children, setCompleted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(0);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [animateStep, setAnimateStep] = useState(true);
  const [achievementUnlocked, setAchievementUnlocked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);

  // Update progress when current step changes
  useEffect(() => {
    const totalSteps = 15;
    const currentProgress = Math.round((currentStep / totalSteps) * 100);
    setProgress(currentProgress);
    
    // Add points when progressing
    setPoints(prev => prev + 5);

    // Show achievement notification at key milestones
    if (currentStep === 5) {
      setAchievementUnlocked("Basic Profile Completed!");
    } else if (currentStep === 10) {
      setAchievementUnlocked("Goal Setting Master!");
    } else if (currentStep === 15) {
      setAchievementUnlocked("Financial Strategist!");
    }

    // Reset animation state
    setAnimateStep(true);
    
    // Hide achievement notification after 3 seconds
    if (achievementUnlocked) {
      const timer = setTimeout(() => {
        setAchievementUnlocked(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Function to update answers
  const updateAnswer = (section: string, value: any) => {
    setAnswers({
      ...answers,
      [section]: value
    });
  };

  // Function to update nested answers
  const updateNestedAnswer = (section: string, subsection: string, value: any) => {
    if (section === 'behavioralBiases') {
      const updatedBiases = {
        ...answers.behavioralBiases,
        [subsection]: value
      };

      setAnswers({
        ...answers,
        behavioralBiases: updatedBiases
      });
    } else if (section === 'riskAppetite' || section === 'absoluteRiskTolerance') {
      const updatedRecord = {
        ...answers[section as 'riskAppetite' | 'absoluteRiskTolerance'],
        [subsection]: value
      };
      
      setAnswers({
        ...answers,
        [section]: updatedRecord
      });
    } else {
      setAnswers(prevState => ({
        ...prevState,
        [section]: {
          ...(prevState[section as keyof typeof prevState] as object || {}),
          [subsection]: value
        }
      }));
    }
  };

  // Handle goal selection
  const handleGoalSelection = (goal: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedGoals([...selectedGoals, goal]);
      // Award points for each goal selected
      setPoints(prev => prev + 3);
    } else {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
      // Reduce points for removing goals
      setPoints(prev => Math.max(0, prev - 2));
    }
  };

  // Update goal-specific answer
  const updateGoalAnswer = (answerType: 'riskAppetite' | 'absoluteRiskTolerance', value: string) => {
    if (selectedGoals.length === 0) return;
    
    const currentGoal = selectedGoals[currentGoalIndex];
    setAnswers({
      ...answers,
      [answerType]: {
        ...answers[answerType],
        [currentGoal]: value
      }
    });
  };

  const handleNextStep = () => {
    // Special case for step 8 (goal selection) - initialize goal-specific state
    if (currentStep === 8 && selectedGoals.length > 0) {
      // Initialize state for goal-specific questions
      const initialGoalPriorities = {};
      const initialGoalRisks = {};
      const initialGoalHorizons = {};
      const initialRiskAppetite = {};
      const initialRiskTolerance = {};
      
      selectedGoals.forEach((goal, index) => {
        initialGoalPriorities[goal] = index + 1;
        initialGoalRisks[goal] = index + 1;
        initialGoalHorizons[goal] = '1-3 years';
        initialRiskAppetite[goal] = '';
        initialRiskTolerance[goal] = '';
      });
      
      setAnswers({
        ...answers,
        riskAppetite: initialRiskAppetite,
        absoluteRiskTolerance: initialRiskTolerance
      });
    }

    // Special handling for goal-specific questions
    if (currentStep === 11 || currentStep === 12 || currentStep === 13) {
      // If we're not at the last goal yet, stay on this question but move to next goal
      if (currentGoalIndex < selectedGoals.length - 1) {
        setCurrentGoalIndex(currentGoalIndex + 1);
        return;
      } else {
        // Reset goal index for next goal-specific question
        setCurrentGoalIndex(0);
      }
    }

    // Reset animation state
    setAnimateStep(false);
    
    // Small delay for animation transition
    setTimeout(() => {
      // Move to next step
      if (currentStep < 15) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete questionnaire with bonus points
        setPoints(prev => prev + 25);
        setCompleted(true);
      }
    }, 200);
  };

  const handlePrevStep = () => {
    // Special handling for goal-specific questions
    if (currentStep === 11 || currentStep === 12 || currentStep === 13) {
      // If we're not at the first goal yet, stay on this question but move to previous goal
      if (currentGoalIndex > 0) {
        setCurrentGoalIndex(currentGoalIndex - 1);
        return;
      }
    }

    // Reset animation state
    setAnimateStep(false);
    
    // Small delay for animation transition
    setTimeout(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }, 200);
  };

  const getLikertScale = (value: number) => {
    switch(value) {
      case 1: return "Strongly Disagree";
      case 2: return "Disagree";
      case 3: return "Neutral";
      case 4: return "Agree";
      case 5: return "Strongly Agree";
      default: return "Neutral";
    }
  };

  const getNumberedBackground = (questionNumber: number) => {
    const colors = [
      'from-blue-500 to-blue-600',   // Step 1
      'from-indigo-500 to-indigo-600', // Step 2
      'from-purple-500 to-purple-600', // Step 3
      'from-fuchsia-500 to-fuchsia-600', // Step 4
      'from-pink-500 to-pink-600',    // Step 5
      'from-rose-500 to-rose-600',    // Step 6
      'from-orange-500 to-orange-600', // Step 7
      'from-amber-500 to-amber-600',  // Step 8
      'from-yellow-500 to-yellow-600', // Step 9
      'from-lime-500 to-lime-600',    // Step 10
      'from-green-500 to-green-600',  // Step 11
      'from-emerald-500 to-emerald-600', // Step 12
      'from-teal-500 to-teal-600',    // Step 13
      'from-cyan-500 to-cyan-600',    // Step 14
      'from-sky-500 to-sky-600'       // Step 15
    ];
    return `bg-gradient-to-br ${colors[questionNumber - 1] || colors[0]}`;
  };

  const value = {
    currentStep,
    setCurrentStep,
    progress,
    setProgress,
    points,
    setPoints,
    answers,
    updateAnswer,
    updateNestedAnswer,
    financialGoals,
    setFinancialGoals,
    selectedGoals,
    setSelectedGoals,
    currentGoalIndex,
    setCurrentGoalIndex,
    achievementUnlocked,
    setAchievementUnlocked,
    animateStep,
    setAnimateStep,
    handleNextStep,
    handlePrevStep,
    updateGoalAnswer,
    handleGoalSelection,
    getLikertScale,
    getNumberedBackground
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

// Custom hook to use the context
export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};
