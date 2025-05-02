
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  CircleCheck, 
  PiggyBank, 
  BarChart3, 
  Home, 
  Car, 
  Heart, 
  BookOpen, 
  Landmark, 
  Sparkles,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
  updateProgress: (percent: number) => void;
}

// Define financial goals with icons
const defaultFinancialGoals = [
  { id: 'living-expenses', name: 'Living expenses', icon: <PiggyBank className="h-5 w-5" /> },
  { id: 'emergency-fund', name: 'Emergency Fund', icon: <CircleCheck className="h-5 w-5" /> },
  { id: 'wealth-accumulation', name: 'Wealth accumulation', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'education', name: 'Education', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'legacy', name: 'Legacy', icon: <Landmark className="h-5 w-5" /> },
  { id: 'car', name: 'Buy a car', icon: <Car className="h-5 w-5" /> },
  { id: 'retirement', name: 'Retirement', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'house', name: 'Buy a house', icon: <Home className="h-5 w-5" /> },
  { id: 'kids', name: 'Having kids', icon: <Heart className="h-5 w-5" /> },
  { id: 'marriage', name: 'Marriage', icon: <Heart className="h-5 w-5" /> },
  { id: 'medical', name: 'Medical & Health', icon: <CircleCheck className="h-5 w-5" /> }
];

// Define interest level options for goals
const interestLevelOptions = [
  "Already planned",
  "Strongly interested",
  "Would consider",
  "Less likely to consider",
  "Would not consider"
];

// Define time horizon options for goals
const timeHorizonOptions = [
  "Less than 1 year",
  "1 to 3 years",
  "4 to 7 years", 
  "8 to 15 years",
  "More than 15 years"
];

// Define a type for the behavioral biases object
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

// Define a type for the goal interest levels
interface GoalInterestLevels {
  [goalId: string]: string;
}

// Define a type for the answers object
interface QuestionnairAnswers {
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
interface Goal {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const Questionnaire = ({ setCompleted, updateProgress }: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [financialGoals, setFinancialGoals] = useState<Goal[]>(defaultFinancialGoals);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const [answers, setAnswers] = useState<QuestionnairAnswers>({
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
      const initialGoalInterestLevels: GoalInterestLevels = {};
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
  const handleAddCustomGoal = () => {
    if (customGoal && !financialGoals.some(goal => goal.name === customGoal)) {
      const newGoal = {
        id: `custom-${Date.now()}`,
        name: customGoal,
        icon: <Star className="h-5 w-5" />
      };
      setFinancialGoals([...financialGoals, newGoal]);
      setSelectedGoals([...selectedGoals, newGoal.id]);
      setCustomGoal('');
    }
  };

  // Handle goal selection
  const handleGoalSelection = (goalId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedGoals([...selectedGoals, goalId]);
    } else {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
    }
  };

  // Handle moving a goal up in priority
  const moveGoalUp = (index: number, priorityType: 'priorities' | 'risks') => {
    if (index <= 0) return;
    
    if (priorityType === 'priorities') {
      const newPriorities = [...answers.goalPriorities];
      [newPriorities[index], newPriorities[index - 1]] = [newPriorities[index - 1], newPriorities[index]];
      setAnswers({...answers, goalPriorities: newPriorities});
    } else {
      const newRiskPreferences = [...answers.goalRiskPreferences];
      [newRiskPreferences[index], newRiskPreferences[index - 1]] = [newRiskPreferences[index - 1], newRiskPreferences[index]];
      setAnswers({...answers, goalRiskPreferences: newRiskPreferences});
    }
  };

  // Handle moving a goal down in priority
  const moveGoalDown = (index: number, priorityType: 'priorities' | 'risks') => {
    const list = priorityType === 'priorities' 
      ? answers.goalPriorities
      : answers.goalRiskPreferences;
      
    if (index >= list.length - 1) return;
    
    if (priorityType === 'priorities') {
      const newPriorities = [...answers.goalPriorities];
      [newPriorities[index], newPriorities[index + 1]] = [newPriorities[index + 1], newPriorities[index]];
      setAnswers({...answers, goalPriorities: newPriorities});
    } else {
      const newRiskPreferences = [...answers.goalRiskPreferences];
      [newRiskPreferences[index], newRiskPreferences[index + 1]] = [newRiskPreferences[index + 1], newRiskPreferences[index]];
      setAnswers({...answers, goalRiskPreferences: newRiskPreferences});
    }
  };

  // Update goal interest level
  const updateGoalInterestLevel = (goalId: string, level: string) => {
    setAnswers({
      ...answers,
      goalInterestLevels: {
        ...answers.goalInterestLevels,
        [goalId]: level
      }
    });
  };
  
  // Function to get goal by ID
  const getGoalById = (goalId: string): Goal | undefined => {
    return financialGoals.find(goal => goal.id === goalId);
  };

  // Handle form submission
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

  const updateAnswer = (section: keyof QuestionnairAnswers, value: any) => {
    setAnswers({
      ...answers,
      [section]: value
    });
  };

  // Update nested answer (for behavioral biases)
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
    }
  };

  // Update goal-specific answer
  const updateGoalAnswer = (answerType: 'riskAppetite' | 'absoluteRiskTolerance', value: string) => {
    const currentGoal = selectedGoals[currentGoalIndex];
    updateNestedAnswer(answerType, currentGoal, value);
  };

  // Update time horizon for a goal
  const updateGoalHorizon = (goalId: string, horizon: string) => {
    setAnswers({
      ...answers,
      goalHorizons: {
        ...answers.goalHorizons,
        [goalId]: horizon
      }
    });
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

  // Function to get background style for numbered questions
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

  // Render question based on current step
  const renderQuestion = () => {
    switch (currentStep) {
      case 1: return (
        <Card className="border-0 shadow-lg overflow-hidden bg-white">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${getNumberedBackground(1)} text-white flex items-center justify-center font-bold`}>1</div>
                <h2 className="text-xl font-semibold">What is your age group?</h2>
              </div>

              <RadioGroup 
                className="grid gap-4 pt-4"
                value={answers.ageGroup} 
                onValueChange={(value) => updateAnswer('ageGroup', value)}
              >
                {[
                  { value: "18-25", label: "18–25 years old" },
                  { value: "26-50", label: "26–50 years old" },
                  { value: "51-60", label: "51–60 years old" },
                  { value: "61-64", label: "61–64 years old" },
                  { value: "65+", label: "65 years old or above" }
                ].map((option) => (
                  <div key={option.value}>
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.ageGroup === option.value ? 
                        'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 
                        'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <RadioGroupItem 
                        value={option.value} 
                        id={`age-${option.value}`} 
                        className="sr-only"
                      />
                      <Label htmlFor={`age-${option.value}`} className="block cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      );

      case 2: return (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${getNumberedBackground(2)} text-white flex items-center justify-center font-bold`}>2</div>
                <h2 className="text-xl font-semibold">What is your average annual income range (in HKD)?</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Includes wages, salaries, business income, interest, financial asset income, rental income, and other non-financial asset income.
              </p>

              <RadioGroup 
                className="grid gap-4"
                value={answers.incomeRange} 
                onValueChange={(value) => updateAnswer('incomeRange', value)}
              >
                {[
                  { value: "below100k", label: "Below HKD 100,000" },
                  { value: "100k-200k", label: "HKD 100,000 (inclusive) – HKD 200,000 (exclusive)" },
                  { value: "200k-500k", label: "HKD 200,000 (inclusive) – HKD 500,000 (inclusive)" },
                  { value: "500k-1m", label: "HKD 500,000 (exclusive) – HKD 1,000,000 (inclusive)" },
                  { value: "1m-2m", label: "HKD 1,000,000 (exclusive) – HKD 2,000,000 (inclusive)" },
                  { value: "above2m", label: "Above HKD 2,000,000" }
                ].map((option) => (
                  <div key={option.value}>
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.incomeRange === option.value ? 
                        'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md' : 
                        'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <RadioGroupItem 
                        value={option.value} 
                        id={`income-${option.value}`} 
                        className="sr-only"
                      />
                      <Label htmlFor={`income-${option.value}`} className="block cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      );
      
      // More cases for other steps would follow here
      default: return (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold mb-4">Question {currentStep}</h2>
              <p>This section is in development. Please continue to the next section.</p>
            </div>
          </CardContent>
        </Card>
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
