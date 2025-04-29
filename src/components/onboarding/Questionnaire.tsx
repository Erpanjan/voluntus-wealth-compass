
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
import { CircleCheck, Trophy, Star, Award, GaugeCircle, PiggyBank, BarChart3, Home, Car, Heart, BookOpen, Landmark, Sparkles } from 'lucide-react';

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

// Define a type for the behavioral biases object to ensure it's correctly typed
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

// Define the type for the answers object
interface QuestionnairAnswers {
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
  const [financialGoals, setFinancialGoals] = useState(defaultFinancialGoals);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalPriorities, setGoalPriorities] = useState<Record<string, number>>({});
  const [goalRisks, setGoalRisks] = useState<Record<string, number>>({});
  const [goalHorizons, setGoalHorizons] = useState<Record<string, string>>({});
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
  });
  
  // Update progress when current step changes
  useEffect(() => {
    const totalSteps = 15;
    setProgress(Math.round((currentStep / totalSteps) * 100));
    
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

  // Handle adding a custom financial goal
  const handleAddCustomGoal = () => {
    if (customGoal && !financialGoals.some(goal => goal.name === customGoal)) {
      const newGoal = {
        id: `custom-${Date.now()}`,
        name: customGoal,
        icon: <Star className="h-5 w-5" />
      };
      setFinancialGoals([...financialGoals, newGoal]);
      setSelectedGoals([...selectedGoals, newGoal.name]);
      setCustomGoal('');
      
      // Award points for creativity
      setPoints(prev => prev + 10);
      setAchievementUnlocked("Creative Thinker!");
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

  // Handle moving a goal up in priority
  const moveGoalUp = (index: number) => {
    if (index <= 0) return;
    const newSelectedGoals = [...selectedGoals];
    [newSelectedGoals[index], newSelectedGoals[index - 1]] = 
    [newSelectedGoals[index - 1], newSelectedGoals[index]];
    setSelectedGoals(newSelectedGoals);
  };

  // Handle moving a goal down in priority
  const moveGoalDown = (index: number) => {
    if (index >= selectedGoals.length - 1) return;
    const newSelectedGoals = [...selectedGoals];
    [newSelectedGoals[index], newSelectedGoals[index + 1]] = 
    [newSelectedGoals[index + 1], newSelectedGoals[index]];
    setSelectedGoals(newSelectedGoals);
  };

  // Handle form submission
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
      
      setGoalPriorities(initialGoalPriorities);
      setGoalRisks(initialGoalRisks);
      setGoalHorizons(initialGoalHorizons);
      
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

  const updateAnswer = (section: string, value: any) => {
    setAnswers({
      ...answers,
      [section]: value
    });
  };

  // Fix for the spread type error with proper type handling
  const updateNestedAnswer = (section: string, subsection: string, value: any) => {
    if (section === 'behavioralBiases') {
      // Use type assertion to tell TypeScript this is a BehavioralBiases object
      const updatedBiases = {
        ...answers.behavioralBiases,
        [subsection]: value
      };

      setAnswers({
        ...answers,
        behavioralBiases: updatedBiases
      });
    } else if (section === 'riskAppetite' || section === 'absoluteRiskTolerance') {
      // Handle these record types explicitly
      const updatedRecord = {
        ...answers[section as 'riskAppetite' | 'absoluteRiskTolerance'],
        [subsection]: value
      };
      
      setAnswers({
        ...answers,
        [section]: updatedRecord
      });
    } else {
      // This should never happen with the current structure, but keep it as a fallback
      setAnswers(prevState => ({
        ...prevState,
        [section]: {
          ...(prevState[section as keyof typeof prevState] as object || {}),
          [subsection]: value
        }
      }));
    }
  };

  // Update goal-specific answer
  const updateGoalAnswer = (answerType: 'riskAppetite' | 'absoluteRiskTolerance', value: string) => {
    const currentGoal = selectedGoals[currentGoalIndex];
    setAnswers({
      ...answers,
      [answerType]: {
        ...answers[answerType],
        [currentGoal]: value
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

  const getGoalInterestOptions = [
    "Already planned",
    "Strongly interested",
    "Would consider",
    "Less likely to consider",
    "Would not consider"
  ];

  const getTimelineOptions = [
    "Less than 1 year",
    "1 to 3 years",
    "4 to 7 years",
    "8 to 15 years",
    "More than 15 years"
  ];

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
      
      {/* Progress Indicator & Points */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {achievement.icon}
            <div>
              <span className="font-medium text-gray-800">{achievement.name}</span>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{progress}% Complete</span>
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="h-4 w-4 mr-1" />
              <span>{points} points</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100" />
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
                    { value: "200k-500k", label: "HKD 200,000 – HKD 500,000" },
                    { value: "500k-1m", label: "HKD 500,000 – HKD 1,000,000" },
                    { value: "1m-2m", label: "HKD 1,000,000 – HKD 2,000,000" },
                    { value: "above2m", label: "Above HKD 2,000,000" }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`relative flex-1 p-4 rounded-lg cursor-pointer transition-all ${
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
                    { value: "1.5m-5m", label: "HKD 1,500,000 – HKD 5,000,000" },
                    { value: "5m-10m", label: "HKD 5,000,000 – HKD 10,000,000" },
                    { value: "10m-100m", label: "HKD 10,000,000 – HKD 100,000,000" },
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
                    { value: "C", label: "Between 2 years and 5 years" },
                    { value: "D", label: "Between 5 years and 8 years" },
                    { value: "E", label: "More than 8 years" }
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
