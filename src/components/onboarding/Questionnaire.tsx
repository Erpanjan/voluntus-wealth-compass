
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  QuestionnaireProps, 
  QuestionnaireAnswers, 
  Goal 
} from './questionnaire/types';
import { 
  defaultFinancialGoals, 
  timeHorizonOptions 
} from './questionnaire/data';
import { 
  AgeGroupQuestion,
  IncomeQuestion,
  NetWorthQuestion,
  InvestmentKnowledgeQuestion,
  InvestmentExperienceQuestion,
  SliderQuestion,
  GoalSelectionQuestion,
  GoalTimeHorizonQuestion,
  GoalRiskAppetiteQuestion,
  GoalRiskToleranceQuestion,
  MarketVolatilityQuestion,
  BehavioralBiasQuestion,
  GoalPriorityQuestion
} from './questionnaire/questions';
import { getGoalById } from './questionnaire/utils';

const Questionnaire = ({ setCompleted, updateProgress }: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [financialGoals, setFinancialGoals] = useState<Goal[]>(defaultFinancialGoals);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    // Basic Information
    ageGroup: '',
    incomeRange: '',
    netWorth: '',
    
    // Knowledge & Experience
    investmentKnowledge: '',
    investmentExperience: '',
    
    // Risk Assessment
    complexProducts: 3,
    investmentComposition: 3,
    
    // Goal-specific data
    goalInterestLevels: {},
    goalPriorities: [],
    goalRiskPreferences: [],
    goalHorizons: {},
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
  });
  
  // Total steps in questionnaire
  const totalSteps = 15;
  
  // Update progress when current step changes
  useEffect(() => {
    const currentProgress = Math.round((currentStep / totalSteps) * 100);
    setProgress(currentProgress);
    
    // Also update the parent component's progress
    updateProgress(currentProgress);
    
    // Mark as completed when we reach the end
    if (currentStep === totalSteps) {
      setCompleted(true);
    }
  }, [currentStep, updateProgress, setCompleted]);

  // Initialize goal-specific data after goal selection
  useEffect(() => {
    if (selectedGoals.length > 0 && Object.keys(answers.goalInterestLevels).length === 0) {
      const initialGoalInterestLevels: Record<string, string> = {};
      const initialGoalHorizons: Record<string, string> = {};
      const initialRiskAppetite: Record<string, string> = {};
      const initialRiskTolerance: Record<string, string> = {};
      
      selectedGoals.forEach(goalId => {
        initialGoalInterestLevels[goalId] = '';
        initialGoalHorizons[goalId] = timeHorizonOptions[1]; // Default to "1 to 3 years"
        initialRiskAppetite[goalId] = '';
        initialRiskTolerance[goalId] = '';
      });
      
      setAnswers(prev => ({
        ...prev,
        goalInterestLevels: initialGoalInterestLevels,
        goalHorizons: initialGoalHorizons,
        goalPriorities: [...selectedGoals],
        goalRiskPreferences: [...selectedGoals],
        riskAppetite: initialRiskAppetite,
        absoluteRiskTolerance: initialRiskTolerance
      }));
    }
  }, [selectedGoals, answers.goalInterestLevels]);

  // Handle adding a custom financial goal
  const handleAddCustomGoal = (newGoal: Goal) => {
    setFinancialGoals([...financialGoals, newGoal]);
    setSelectedGoals([...selectedGoals, newGoal.id]);
  };

  // Handle goal selection
  const handleGoalSelection = (goalId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedGoals([...selectedGoals, goalId]);
    } else {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
    }
  };

  // Handle reordering goal priorities
  const handleReorderGoals = (newOrder: string[]) => {
    setAnswers(prev => ({
      ...prev,
      goalPriorities: newOrder
    }));
  };

  // Handle reordering risk preferences
  const handleReorderRiskPreferences = (newOrder: string[]) => {
    setAnswers(prev => ({
      ...prev,
      goalRiskPreferences: newOrder
    }));
  };

  // Update a simple answer
  const updateAnswer = (section: keyof QuestionnaireAnswers, value: any) => {
    setAnswers({
      ...answers,
      [section]: value
    });
  };

  // Handle navigation to next question
  const handleNextStep = () => {
    // Special handling for goal-specific questions
    if ((currentStep === 11 || currentStep === 12 || currentStep === 13) && selectedGoals.length > 0) {
      // If we're not at the last goal yet, stay on this question but move to next goal
      if (currentGoalIndex < selectedGoals.length - 1) {
        setCurrentGoalIndex(currentGoalIndex + 1);
        return;
      } else {
        // Reset goal index for next goal-specific question
        setCurrentGoalIndex(0);
      }
    }
    
    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  // Handle navigation to previous question
  const handlePrevStep = () => {
    // Special handling for goal-specific questions
    if ((currentStep === 11 || currentStep === 12 || currentStep === 13) && selectedGoals.length > 0) {
      // If we're not at the first goal yet, stay on this question but move to previous goal
      if (currentGoalIndex > 0) {
        setCurrentGoalIndex(currentGoalIndex - 1);
        return;
      }
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update goal-specific answer
  const updateGoalAnswer = (answerType: 'riskAppetite' | 'absoluteRiskTolerance', value: string) => {
    const currentGoal = selectedGoals[currentGoalIndex];
    setAnswers(prev => ({
      ...prev,
      [answerType]: {
        ...prev[answerType],
        [currentGoal]: value
      }
    }));
  };

  // Update behavioral bias answer
  const updateBehavioralBias = (biasKey: keyof QuestionnaireAnswers['behavioralBiases'], value: number) => {
    setAnswers(prev => ({
      ...prev,
      behavioralBiases: {
        ...prev.behavioralBiases,
        [biasKey]: value
      }
    }));
  };

  // Get current goal for goal-specific questions
  const getCurrentGoal = () => {
    if (selectedGoals.length === 0 || currentGoalIndex >= selectedGoals.length) {
      return null;
    }
    
    const currentGoalId = selectedGoals[currentGoalIndex];
    return getGoalById(financialGoals, currentGoalId);
  };
  
  // Render the current question based on step
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <AgeGroupQuestion 
            value={answers.ageGroup} 
            onChange={(value) => updateAnswer('ageGroup', value)} 
          />
        );
      
      case 2:
        return (
          <IncomeQuestion 
            value={answers.incomeRange} 
            onChange={(value) => updateAnswer('incomeRange', value)} 
          />
        );
        
      case 3:
        return (
          <NetWorthQuestion 
            value={answers.netWorth} 
            onChange={(value) => updateAnswer('netWorth', value)} 
          />
        );
        
      case 4:
        return (
          <InvestmentKnowledgeQuestion
            value={answers.investmentKnowledge}
            onChange={(value) => updateAnswer('investmentKnowledge', value)}
          />
        );
      
      case 5:
        return (
          <InvestmentExperienceQuestion
            value={answers.investmentExperience}
            onChange={(value) => updateAnswer('investmentExperience', value)}
          />
        );
      
      case 6:
        return (
          <SliderQuestion
            questionNumber={6}
            title="Complex Products Suitability"
            description="I feel confident investing in complex financial products such as derivatives, structured notes, or leveraged instruments, even if they require advanced financial knowledge to understand the risks."
            value={answers.complexProducts}
            onChange={(value) => updateAnswer('complexProducts', value)}
          />
        );
      
      case 7:
        return (
          <SliderQuestion
            questionNumber={7}
            title="Investment Composition"
            description="My current portfolio includes significant investments in a single asset class (e.g., stocks, bonds) or specific products (e.g., real estate, cryptocurrencies)"
            value={answers.investmentComposition}
            onChange={(value) => updateAnswer('investmentComposition', value)}
          />
        );
      
      case 8:
        return (
          <GoalSelectionQuestion
            questionNumber={8}
            goals={financialGoals}
            selectedGoals={selectedGoals}
            onGoalSelection={handleGoalSelection}
            onAddCustomGoal={handleAddCustomGoal}
          />
        );

      case 9:
        return (
          <GoalPriorityQuestion
            questionNumber={9}
            title="Financial Priorities"
            description="Rank the financial goals below in the order of least acceptable to fail:"
            goals={financialGoals}
            goalOrder={answers.goalPriorities}
            getGoalById={(goalId) => getGoalById(financialGoals, goalId)}
            onReorder={handleReorderGoals}
          />
        );

      case 10:
        return (
          <GoalPriorityQuestion
            questionNumber={10}
            title="Risk Preferences"
            description="Rank the following items in terms of the risk you are willing to take with your investments:"
            goals={financialGoals}
            goalOrder={answers.goalRiskPreferences}
            getGoalById={(goalId) => getGoalById(financialGoals, goalId)}
            onReorder={handleReorderRiskPreferences}
          />
        );

      case 11: {
        const currentGoal = getCurrentGoal();
        if (!currentGoal) return null;
        
        return (
          <GoalTimeHorizonQuestion
            questionNumber={11}
            goal={currentGoal}
            value={answers.goalHorizons[currentGoal.id] || ''}
            onChange={(value) => {
              setAnswers(prev => ({
                ...prev,
                goalHorizons: {
                  ...prev.goalHorizons,
                  [currentGoal.id]: value
                }
              }));
            }}
          />
        );
      }
      
      case 12: {
        const currentGoal = getCurrentGoal();
        if (!currentGoal) return null;
        
        return (
          <GoalRiskAppetiteQuestion
            questionNumber={12}
            goal={currentGoal}
            value={answers.riskAppetite[currentGoal.id] || ''}
            onChange={(value) => updateGoalAnswer('riskAppetite', value)}
          />
        );
      }
      
      case 13: {
        const currentGoal = getCurrentGoal();
        if (!currentGoal) return null;
        
        return (
          <GoalRiskToleranceQuestion
            questionNumber={13}
            goal={currentGoal}
            value={answers.absoluteRiskTolerance[currentGoal.id] || ''}
            onChange={(value) => updateGoalAnswer('absoluteRiskTolerance', value)}
          />
        );
      }

      case 14:
        return (
          <MarketVolatilityQuestion
            questionNumber={14}
            value={answers.marketVolatilityResponse}
            onChange={(value) => updateAnswer('marketVolatilityResponse', value)}
          />
        );

      case 15:
        return (
          <BehavioralBiasQuestion
            questionNumber={15}
            title="Behavioral Biases"
            description="I would sell an investment if it dropped 25% in value within the first six months, even if there is a chance it could recover in the future."
            biasKey="sellOnDrop"
            value={answers.behavioralBiases.sellOnDrop}
            onChange={(value) => updateBehavioralBias('sellOnDrop', value)}
          />
        );
      
      default:
        return (
          <div className="p-8 text-center">
            <p>This section is in development. Please continue to the next section.</p>
          </div>
        );
    }
  };

  // Display goal name and progress for goal-specific questions
  const getGoalProgressText = () => {
    if (currentStep >= 11 && currentStep <= 13 && selectedGoals.length > 0) {
      const currentGoal = getCurrentGoal();
      if (currentGoal) {
        return `Goal ${currentGoalIndex + 1} of ${selectedGoals.length}: ${currentGoal.name}`;
      }
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Question {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-amber-100" 
          style={{ '--tw-bg-opacity': 0.2 }}
        />
        
        {/* Display goal progress if on a goal-specific question */}
        {getGoalProgressText() && (
          <div className="mt-2 text-sm font-medium text-amber-600 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
            {getGoalProgressText()}
          </div>
        )}
      </div>

      {/* Question container */}
      <div className="mb-6">
        {renderQuestion()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="border-amber-200 text-amber-700 hover:text-amber-900 hover:bg-amber-50"
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNextStep}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          {currentStep === totalSteps ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
