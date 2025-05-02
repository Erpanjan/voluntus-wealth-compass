
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  CircleCheck, 
  Trophy, 
  Star, 
  Award, 
  GaugeCircle, 
  PiggyBank, 
  BarChart3, 
  Home, 
  Car, 
  Heart, 
  BookOpen, 
  Landmark, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

const Questionnaire = ({ setCompleted }: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [financialGoals, setFinancialGoals] = useState<Goal[]>(defaultFinancialGoals);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [animateStep, setAnimateStep] = useState(true);
  const [achievementUnlocked, setAchievementUnlocked] = useState<string | null>(null);
  const [points, setPoints] = useState(0);

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
  }, [currentStep, achievementUnlocked]);

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
  }, [selectedGoals]);

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
      
      // Award points for creativity
      setPoints(prev => prev + 10);
      setAchievementUnlocked("Creative Thinker!");
    }
  };

  // Handle goal selection
  const handleGoalSelection = (goalId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedGoals([...selectedGoals, goalId]);
      // Award points for each goal selected
      setPoints(prev => prev + 3);
    } else {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
      // Reduce points for removing goals
      setPoints(prev => Math.max(0, prev - 2));
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
    if ((currentStep === 11 || currentStep === 12 || currentStep === 13) && selectedGoals.length > 0) {
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

  // Map step number to achievement/reward metaphor
  const getStepAchievement = (step: number) => {
    const achievements = [
      { name: "Foundation Builder", icon: <GaugeCircle className="h-6 w-6 text-blue-500" />, description: "Building your financial profile" },
      { name: "Financial Explorer", icon: <Star className="h-6 w-6 text-purple-500" />, description: "Exploring investment expertise" },
      { name: "Investment Apprentice", icon: <Award className="h-6 w-6 text-amber-500" />, description: "Setting financial goals" },
      { name: "Goal Hunter", icon: <Trophy className="h-6 w-6 text-green-500" />, description: "Defining your risk tolerance" },
      { name: "Strategic Planner", icon: <CircleCheck className="h-6 w-6 text-pink-500" />, description: "Completing your financial strategy" }
    ];
    
    // Map step ranges to achievements
    if (step >= 1 && step <= 3) return achievements[0];
    if (step >= 4 && step <= 7) return achievements[1];
    if (step >= 8 && step <= 10) return achievements[2];
    if (step >= 11 && step <= 13) return achievements[3];
    return achievements[4];
  };

  const achievement = getStepAchievement(currentStep);

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

  return (
    <div className="space-y-6 pb-8">
      {/* Achievement Notification */}
      {achievementUnlocked && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-amber-400 to-amber-600 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6" />
            <div>
              <p className="font-bold">Achievement Unlocked!</p>
              <p>{achievementUnlocked}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Progress Indicator & Points - Simplified but maintaining point system */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {achievement.icon}
            <div>
              <span className="font-medium text-gray-800">{achievement.name}</span>
            </div>
          </div>
          <div className="flex items-center text-amber-500 font-bold">
            <Star className="h-4 w-4 mr-1" />
            <span>{points} points</span>
          </div>
        </div>
      </div>

      {/* Question Container with Animation */}
      <motion.div
        initial="hidden"
        animate={animateStep ? "visible" : "hidden"}
        variants={scaleIn}
        key={`step-${currentStep}-${currentGoalIndex}`}
        className="mb-6"
      >
        {/* Step 1: Age Group */}
        {currentStep === 1 && (
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
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all transform hover:scale-102 ${
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
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Annual Income Range */}
        {currentStep === 2 && (
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
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
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
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Net Worth */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(3)} text-white flex items-center justify-center font-bold`}>3</div>
                  <h2 className="text-xl font-semibold">What is your total personal net worth (in HKD)?</h2>
                </div>
                <p className="text-gray-600 text-sm">
                  Including residential properties and operational business assets, cash deposits, stocks, bonds, insurance, 
                  and physical asset investments, after deducting liabilities such as mortgage loans, credit card debt, etc.
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.netWorth} 
                  onValueChange={(value) => updateAnswer('netWorth', value)}
                >
                  {[
                    { value: "below1.5m", label: "Below HKD 1,500,000" },
                    { value: "1.5m-5m", label: "HKD 1,500,000 (inclusive) – HKD 5,000,000 (inclusive)" },
                    { value: "5m-10m", label: "HKD 5,000,000 (exclusive) – HKD 10,000,000 (inclusive)" },
                    { value: "10m-100m", label: "HKD 10,000,000 (exclusive) – HKD 100,000,000 (inclusive)" },
                    { value: "above100m", label: "Above HKD 100,000,000" }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.netWorth === option.value ? 
                          'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`networth-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`networth-${option.value}`} className="block cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Investment Knowledge */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(4)} text-white flex items-center justify-center font-bold`}>4</div>
                  <h2 className="text-xl font-semibold">Investment Knowledge and Experience</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Which of the following best describes your investment knowledge and experience?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.investmentKnowledge} 
                  onValueChange={(value) => updateAnswer('investmentKnowledge', value)}
                >
                  {[
                    { value: "A", label: "Apart from saving deposits, government bonds, and money market funds, I do not invest in other financial products. My investment knowledge is relatively limited." },
                    { value: "B", label: "Most of my investments are in savings deposits, government bonds, and money market funds, with limited investments in stocks, mutual funds, and riskier products. My investment knowledge is somewhat limited." },
                    { value: "C", label: "My investments are diversified across savings, government bonds, trust products, stocks, and mutual funds. I have a certain level of investment knowledge." },
                    { value: "D", label: "Most of my investments are in stocks, mutual funds, forex, and other higher-risk products, with limited investments in savings, government bonds, and money market funds. I have advanced investment knowledge." }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.investmentKnowledge === option.value ? 
                          'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`knowledge-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`knowledge-${option.value}`} className="block cursor-pointer text-sm">
                          {option.label}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Investment Experience */}
        {currentStep === 5 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(5)} text-white flex items-center justify-center font-bold`}>5</div>
                  <h2 className="text-xl font-semibold">Investment Experience</h2>
                </div>
                <p className="text-sm text-gray-600">
                  How many years of experience do you have investing in stocks, mutual funds (excluding money market funds), 
                  forex, and other higher-risk financial products?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.investmentExperience} 
                  onValueChange={(value) => updateAnswer('investmentExperience', value)}
                >
                  {[
                    { value: "A", label: "No experience" },
                    { value: "B", label: "Some experience, but less than 2 years" },
                    { value: "C", label: "Between 2 years (inclusive) and 5 years (inclusive)" },
                    { value: "D", label: "Between 5 years (inclusive) and 8 years (inclusive)" },
                    { value: "E", label: "More than 8 years (exclusive)" }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.investmentExperience === option.value ? 
                          'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`experience-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`experience-${option.value}`} className="block cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Complex Products Suitability */}
        {currentStep === 6 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(6)} text-white flex items-center justify-center font-bold`}>6</div>
                  <h2 className="text-xl font-semibold">Complex Products Suitability</h2>
                </div>
                
                <div className="space-y-8">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm font-medium">
                      "I feel confident investing in complex financial products such as derivatives, structured notes, 
                      or leveraged instruments, even if they require advanced financial knowledge to understand the risks."
                    </p>

                    <div className="pt-6">
                      <Slider 
                        value={[answers.complexProducts]} 
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(value) => updateAnswer('complexProducts', value[0])}
                        className="w-full"
                      />
                      
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>
                      
                      <div className="text-center mt-4 font-medium">
                        {getLikertScale(answers.complexProducts)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Investment Composition */}
        {currentStep === 7 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(7)} text-white flex items-center justify-center font-bold`}>7</div>
                  <h2 className="text-xl font-semibold">Investment Composition</h2>
                </div>
                
                <div className="space-y-8">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm font-medium">
                      "My current portfolio includes significant investments in a single asset class (e.g., stocks, bonds) 
                      or specific products (e.g., real estate, cryptocurrencies)"
                    </p>

                    <div className="pt-6">
                      <Slider 
                        value={[answers.investmentComposition]} 
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(value) => updateAnswer('investmentComposition', value[0])}
                        className="w-full"
                      />
                      
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>
                      
                      <div className="text-center mt-4 font-medium">
                        {getLikertScale(answers.investmentComposition)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Future Expense Goals */}
        {currentStep === 8 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(8)} text-white flex items-center justify-center font-bold`}>8</div>
                  <h2 className="text-xl font-semibold">Future Expense Goals</h2>
                </div>

                <p className="text-gray-600 text-sm">
                  Indicate your level of interest in the following future expense items. Select all that apply to you.
                </p>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {financialGoals.map((goal) => (
                    <motion.div 
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <label htmlFor={`goal-${goal.id}`} className="font-medium cursor-pointer">{goal.name}</label>
                            <Checkbox 
                              id={`goal-${goal.id}`}
                              checked={selectedGoals.includes(goal.id)}
                              onCheckedChange={(checked) => handleGoalSelection(goal.id, checked === true)}
                              className="h-5 w-5"
                            />
                          </div>
                        </div>
                      </div>

                      {selectedGoals.includes(goal.id) && (
                        <div className="ml-10 mt-3">
                          <p className="text-sm text-gray-600 mb-2">Interest level:</p>
                          <RadioGroup 
                            value={answers.goalInterestLevels[goal.id] || interestLevelOptions[0]}
                            onValueChange={(value) => updateGoalInterestLevel(goal.id, value)}
                            className="flex flex-wrap gap-2"
                          >
                            {interestLevelOptions.map((level) => (
                              <div 
                                key={`${goal.id}-${level}`}
                                className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                                  answers.goalInterestLevels[goal.id] === level 
                                    ? 'bg-amber-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                <RadioGroupItem 
                                  value={level} 
                                  id={`${goal.id}-${level}`} 
                                  className="sr-only" 
                                />
                                <Label htmlFor={`${goal.id}-${level}`} className="cursor-pointer">
                                  {level}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="custom-goal" className="text-sm font-medium mb-1 block">
                      Add a custom financial goal
                    </Label>
                    <Input 
                      id="custom-goal"
                      placeholder="E.g., Start a business"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={handleAddCustomGoal}
                    disabled={!customGoal}
                    type="button"
                    className="h-10"
                  >
                    Add Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 9: Financial Priorities */}
        {currentStep === 9 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(9)} text-white flex items-center justify-center font-bold`}>9</div>
                  <h2 className="text-xl font-semibold">Financial Priorities</h2>
                </div>

                <p className="text-gray-600 text-sm">
                  Rank your financial goals in the order of least acceptable to fail (most important at the top).
                  Drag or use arrows to reorder.
                </p>

                <div className="space-y-2 mt-4">
                  {answers.goalPriorities.map((goalId, index) => {
                    const goal = getGoalById(goalId);
                    if (!goal) return null;
                    
                    return (
                      <motion.div 
                        key={`priority-${goalId}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm"
                      >
                        <div className="text-lg font-bold w-8 text-center">{index + 1}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            {goal.icon}
                          </div>
                          <span>{goal.name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveGoalUp(index, 'priorities')} 
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveGoalDown(index, 'priorities')} 
                            disabled={index === answers.goalPriorities.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 10: Risk Preferences */}
        {currentStep === 10 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(10)} text-white flex items-center justify-center font-bold`}>10</div>
                  <h2 className="text-xl font-semibold">Risk Preferences</h2>
                </div>

                <p className="text-gray-600 text-sm">
                  Rank your financial goals in terms of the risk you are willing to take with your investments 
                  (most risk-tolerant at the top).
                </p>

                <div className="space-y-2 mt-4">
                  {answers.goalRiskPreferences.map((goalId, index) => {
                    const goal = getGoalById(goalId);
                    if (!goal) return null;
                    
                    return (
                      <motion.div 
                        key={`risk-${goalId}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm"
                      >
                        <div className="text-lg font-bold w-8 text-center">{index + 1}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            {goal.icon}
                          </div>
                          <span>{goal.name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveGoalUp(index, 'risks')} 
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveGoalDown(index, 'risks')} 
                            disabled={index === answers.goalRiskPreferences.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 11: Investment Horizon */}
        {currentStep === 11 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(11)} text-white flex items-center justify-center font-bold`}>11</div>
                  <div>
                    <h2 className="text-xl font-semibold">Investment Horizon</h2>
                    <p className="text-sm text-gray-600">
                      Goal {currentGoalIndex + 1} of {selectedGoals.length}: {getGoalById(selectedGoals[currentGoalIndex])?.name}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white p-2 rounded-full shadow">
                      {getGoalById(selectedGoals[currentGoalIndex])?.icon}
                    </div>
                    <h3 className="text-lg font-medium">
                      What is the timeline for <span className="font-bold">{getGoalById(selectedGoals[currentGoalIndex])?.name}</span>?
                    </h3>
                  </div>
                  
                  <RadioGroup 
                    value={answers.goalHorizons[selectedGoals[currentGoalIndex]] || timeHorizonOptions[1]}
                    onValueChange={(value) => updateGoalHorizon(selectedGoals[currentGoalIndex], value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2"
                  >
                    {timeHorizonOptions.map((horizon) => (
                      <div
                        key={`horizon-${horizon}`}
                        className={`px-4 py-3 rounded-lg cursor-pointer transition-all ${
                          answers.goalHorizons[selectedGoals[currentGoalIndex]] === horizon
                            ? 'bg-green-500 text-white shadow-md' 
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        <RadioGroupItem 
                          value={horizon} 
                          id={`horizon-${horizon}`} 
                          className="sr-only" 
                        />
                        <Label htmlFor={`horizon-${horizon}`} className="block cursor-pointer text-center">
                          {horizon}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 12: Risk Appetite */}
        {currentStep === 12 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(12)} text-white flex items-center justify-center font-bold`}>12</div>
                  <div>
                    <h2 className="text-xl font-semibold">Risk Appetite</h2>
                    <p className="text-sm text-gray-600">
                      Goal {currentGoalIndex + 1} of {selectedGoals.length}: {getGoalById(selectedGoals[currentGoalIndex])?.name}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white p-2 rounded-full shadow">
                      {getGoalById(selectedGoals[currentGoalIndex])?.icon}
                    </div>
                    <h3 className="text-lg font-medium">
                      Which of the following best describes your risk appetite for <span className="font-bold">{getGoalById(selectedGoals[currentGoalIndex])?.name}</span>?
                    </h3>
                  </div>

                  <RadioGroup 
                    value={answers.riskAppetite[selectedGoals[currentGoalIndex]] || ''}
                    onValueChange={(value) => updateGoalAnswer('riskAppetite', value)}
                    className="space-y-3"
                  >
                    {[
                      { value: "A", label: "I am risk-averse, do not want to lose my principal, and prefer to achieve stable returns." },
                      { value: "B", label: "I prefer to preserve my investments, do not want to lose my principal, but am willing to accept a certain level of income fluctuation." },
                      { value: "C", label: "I seek higher returns and growth for my capital, and am willing to accept limited losses to my principal." },
                      { value: "D", label: "I aim for high returns and am willing to bear relatively significant losses to my principal to achieve this." }
                    ].map((option) => (
                      <div 
                        key={`risk-appetite-${option.value}`}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          answers.riskAppetite[selectedGoals[currentGoalIndex]] === option.value
                            ? 'bg-emerald-500 text-white shadow-md' 
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-appetite-${option.value}`} 
                          className="sr-only" 
                        />
                        <Label htmlFor={`risk-appetite-${option.value}`} className="block cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 13: Absolute Risk Tolerance */}
        {currentStep === 13 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(13)} text-white flex items-center justify-center font-bold`}>13</div>
                  <div>
                    <h2 className="text-xl font-semibold">Absolute Risk Tolerance</h2>
                    <p className="text-sm text-gray-600">
                      Goal {currentGoalIndex + 1} of {selectedGoals.length}: {getGoalById(selectedGoals[currentGoalIndex])?.name}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white p-2 rounded-full shadow">
                      {getGoalById(selectedGoals[currentGoalIndex])?.icon}
                    </div>
                    <h3 className="text-lg font-medium">
                      Which of the following best describes the absolute loss you could tolerate for <span className="font-bold">{getGoalById(selectedGoals[currentGoalIndex])?.name}</span>?
                    </h3>
                  </div>

                  <RadioGroup 
                    value={answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] || ''}
                    onValueChange={(value) => updateGoalAnswer('absoluteRiskTolerance', value)}
                    className="space-y-3"
                  >
                    {[
                      { value: "A", label: "No loss of principal, but the returns fall short of expectations." },
                      { value: "B", label: "Loss of principal up to 5% (inclusive)." },
                      { value: "C", label: "Loss of principal between 5% (exclusive) and 10% (inclusive)." },
                      { value: "D", label: "Loss of principal between 10% (exclusive) and 15% (inclusive)." },
                      { value: "E", label: "Loss of principal between 15% (exclusive) and 20% (inclusive)." },
                      { value: "F", label: "Loss of principal exceeding 30%." }
                    ].map((option) => (
                      <div 
                        key={`risk-tolerance-${option.value}`}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] === option.value
                            ? 'bg-teal-500 text-white shadow-md' 
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-tolerance-${option.value}`} 
                          className="sr-only" 
                        />
                        <Label htmlFor={`risk-tolerance-${option.value}`} className="block cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 14: Behavioral Response to Market Volatility */}
        {currentStep === 14 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(14)} text-white flex items-center justify-center font-bold`}>14</div>
                  <h2 className="text-xl font-semibold">Behavioral Response to Market Volatility</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Imagine your investment portfolio drops by 15% in a short period due to market volatility. 
                  How would you respond?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.marketVolatilityResponse} 
                  onValueChange={(value) => updateAnswer('marketVolatilityResponse', value)}
                >
                  {[
                    { value: "A", label: "Sell all investments to prevent further losses." },
                    { value: "B", label: "Sell a portion of investments to reduce exposure." },
                    { value: "C", label: "Hold all investments, anticipating a market rebound." },
                    { value: "D", label: "Invest additional funds to capitalize on lower prices." }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.marketVolatilityResponse === option.value ? 
                          'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`volatility-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`volatility-${option.value}`} className="block cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 15: Behavioral Biases */}
        {currentStep === 15 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(15)} text-white flex items-center justify-center font-bold`}>15</div>
                  <h2 className="text-xl font-semibold">Behavioral Biases</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Respond to the following statements using the slider to indicate your level of agreement.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  {/* SellOnDrop */}
                  <AccordionItem value="sellOnDrop" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Selling on a Drop</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.sellOnDrop)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I would sell an investment if it dropped 25% in value within the first six months, even if there is a chance it could recover in the future."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.sellOnDrop]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'sellOnDrop', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Emotional Attachment */}
                  <AccordionItem value="emotionalAttachment" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Emotional Attachment</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.emotionalAttachment)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I tend to feel emotionally attached to my investments, making it difficult to part with them even if it's the rational choice."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.emotionalAttachment]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'emotionalAttachment', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Stability Preference */}
                  <AccordionItem value="preferStability" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Stability Preference</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.preferStability)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I prefer to maintain my existing investments rather than frequently buying and selling assets."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.preferStability]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'preferStability', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Hopeful Recovery */}
                  <AccordionItem value="hopefulRecovery" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Hopeful Recovery</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.hopefulRecovery)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I would hesitate to sell a stock that I purchased at $50, even if it dropped to $40, hoping it will return to its original price."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.hopefulRecovery]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'hopefulRecovery', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mental Accounting */}
                  <AccordionItem value="mentalAccounting" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Mental Accounting</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.mentalAccounting)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I tend to allocate my money into different categories based on specific financial goals rather than looking at my overall financial picture."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.mentalAccounting]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'mentalAccounting', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Past Influence */}
                  <AccordionItem value="pastInfluence" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Past Investment Influence</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.pastInfluence)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "Past investment mistakes strongly influence my current investment decisions, making me overly cautious about taking risks."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.pastInfluence]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'pastInfluence', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Predictability */}
                  <AccordionItem value="predictability" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Market Predictability</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.predictability)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I believe that investment outcomes are predictable if enough information is available."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.predictability]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'predictability', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Profit Over Plan */}
                  <AccordionItem value="profitOverPlan" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Profit Over Plan</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.profitOverPlan)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "The most important thing about my investments is that they make money, even if it means not following a structured plan."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.profitOverPlan]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'profitOverPlan', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Value Alignment */}
                  <AccordionItem value="valueAlignment" className="border-b">
                    <AccordionTrigger className="hover:no-underline py-4 text-sm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Value Alignment</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {getLikertScale(answers.behavioralBiases.valueAlignment)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          "I prefer to invest in companies that align with my personal values, such as environmental, social, or governance principles."
                        </p>
                        <Slider 
                          value={[answers.behavioralBiases.valueAlignment]} 
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => updateNestedAnswer('behavioralBiases', 'valueAlignment', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNextStep}>
          {currentStep === 15 ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
