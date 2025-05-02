import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuestionnaireProps, QuestionnaireAnswers, Goal } from './questionnaire/types';
import { defaultFinancialGoals, interestLevelOptions, timeHorizonOptions } from './questionnaire/data';
import { updateNestedAnswer } from './questionnaire/utils';

// Import question components
import AgeGroupQuestion from './questionnaire/questions/AgeGroupQuestion';
import IncomeQuestion from './questionnaire/questions/IncomeQuestion';
import GoalSelectionQuestion from './questionnaire/questions/GoalSelectionQuestion';
import GenericRadioQuestion from './questionnaire/questions/GenericRadioQuestion';
import SliderQuestion from './questionnaire/questions/SliderQuestion';

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
  
  // Update progress when current step changes
  useEffect(() => {
    const totalSteps = 15;
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
        initialGoalInterestLevels[goalId] = interestLevelOptions[0];
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
    if (currentStep < 15) {
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
    setAnswers(updateNestedAnswer(answers, answerType, currentGoal, value));
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
          <GenericRadioQuestion 
            questionNumber={3}
            title="What is your total personal net worth (in HKD)?"
            description="Including residential properties and operational business assets, cash deposits, stocks, bonds, insurance, and physical asset investments, after deducting liabilities such as mortgage loans, credit card debt, etc."
            options={[
              { value: "below1.5m", label: "Below HKD 1,500,000" },
              { value: "1.5m-5m", label: "HKD 1,500,000 (inclusive) – HKD 5,000,000 (inclusive)" },
              { value: "5m-10m", label: "HKD 5,000,000 (exclusive) – HKD 10,000,000 (inclusive)" },
              { value: "10m-100m", label: "HKD 10,000,000 (exclusive) – HKD 100,000,000 (inclusive)" },
              { value: "above100m", label: "Above HKD 100,000,000" }
            ]}
            value={answers.netWorth}
            onChange={(value) => updateAnswer('netWorth', value)}
            gradientClass="from-purple-500 to-purple-600"
          />
        );
        
      case 4:
        return (
          <GenericRadioQuestion 
            questionNumber={4}
            title="Investment Knowledge and Experience"
            description="Which of the following best describes your investment knowledge and experience?"
            options={[
              { value: "A", label: "Apart from saving deposits, government bonds, and money market funds, I do not invest in other financial products. My investment knowledge is relatively limited." },
              { value: "B", label: "Most of my investments are in savings deposits, government bonds, and money market funds, with limited investments in stocks, mutual funds, and riskier products. My investment knowledge is somewhat limited." },
              { value: "C", label: "My investments are diversified across savings, government bonds, trust products, stocks, and mutual funds. I have a certain level of investment knowledge." },
              { value: "D", label: "Most of my investments are in stocks, mutual funds, forex, and other higher-risk products, with limited investments in savings, government bonds, and money market funds. I have advanced investment knowledge." }
            ]}
            value={answers.investmentKnowledge}
            onChange={(value) => updateAnswer('investmentKnowledge', value)}
            gradientClass="from-fuchsia-500 to-fuchsia-600"
          />
        );
      
      case 5:
        return (
          <GenericRadioQuestion 
            questionNumber={5}
            title="Investment Experience"
            description="How many years of experience do you have investing in stocks, mutual funds (excluding money market funds), forex, and other higher-risk financial products?"
            options={[
              { value: "A", label: "No experience" },
              { value: "B", label: "Some experience, but less than 2 years" },
              { value: "C", label: "Between 2 years (inclusive) and 5 years (inclusive)" },
              { value: "D", label: "Between 5 years (inclusive) and 8 years (inclusive)" },
              { value: "E", label: "More than 8 years (exclusive)" }
            ]}
            value={answers.investmentExperience}
            onChange={(value) => updateAnswer('investmentExperience', value)}
            gradientClass="from-pink-500 to-pink-600"
          />
        );
      
      case 6:
        return (
          <SliderQuestion
            questionNumber={6}
            title="Complex Financial Products"
            description="How comfortable are you with complex financial products like derivatives, futures, and options?"
            value={answers.complexProducts}
            onChange={(value) => updateAnswer('complexProducts', value)}
          />
        );
      
      case 7:
        return (
          <SliderQuestion
            questionNumber={7}
            title="Investment Composition"
            description="I prefer an investment portfolio that contains more high-risk/high-return products."
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
      
      // Add more cases for other steps here...
      
      default:
        return (
          <div className="p-8 text-center">
            <p>This section is in development. Please continue to the next section.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Question {currentStep} of 15</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
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
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNextStep}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          {currentStep === 15 ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
