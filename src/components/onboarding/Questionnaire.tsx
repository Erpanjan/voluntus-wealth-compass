
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
                    </div>

                    <div className="flex justify-between px-2 text-sm text-gray-600 mt-2">
                      <span>Strongly Disagree</span>
                      <span>Neutral</span>
                      <span>Strongly Agree</span>
                    </div>

                    <motion.div 
                      className={`p-4 rounded-lg mt-6 text-center text-white shadow-md ${
                        answers.complexProducts <= 2 
                          ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                          : answers.complexProducts === 3 
                          ? "bg-gradient-to-r from-amber-500 to-amber-600" 
                          : "bg-gradient-to-r from-rose-500 to-rose-600"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="font-medium">Your response: {getLikertScale(answers.complexProducts)}</span>
                    </motion.div>
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
                      "My current portfolio includes significant investments in a single asset class 
                      (e.g., stocks, bonds) or specific products (e.g., real estate, cryptocurrencies)"
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
                    </div>

                    <div className="flex justify-between px-2 text-sm text-gray-600 mt-2">
                      <span>Strongly Disagree</span>
                      <span>Neutral</span>
                      <span>Strongly Agree</span>
                    </div>

                    <motion.div 
                      className={`p-4 rounded-lg mt-6 text-center text-white shadow-md ${
                        answers.investmentComposition <= 2 
                          ? "bg-gradient-to-r from-green-500 to-green-600" 
                          : answers.investmentComposition === 3 
                          ? "bg-gradient-to-r from-amber-500 to-amber-600" 
                          : "bg-gradient-to-r from-orange-500 to-orange-600"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="font-medium">Your response: {getLikertScale(answers.investmentComposition)}</span>
                    </motion.div>
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
                <p className="text-sm text-gray-600">
                  Indicate your level of interest in the following future expense items:
                </p>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-2 pb-2">
                  {financialGoals.map((goal, idx) => (
                    <motion.div 
                      key={goal.id} 
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Checkbox 
                        id={`goal-${goal.id}`} 
                        checked={selectedGoals.includes(goal.name)}
                        onCheckedChange={(checked) => handleGoalSelection(goal.name, checked === true)}
                        className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                      <div className="flex items-center">
                        <span className="mr-2">{goal.icon}</span>
                        <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer">{goal.name}</Label>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Custom goal input */}
                <motion.div 
                  className="pt-4 space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="custom-goal">Add Other Financial Goal:</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="custom-goal"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="flex-1"
                      placeholder="Enter a financial goal..."
                    />
                    <Button 
                      onClick={handleAddCustomGoal} 
                      type="button"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      Add
                    </Button>
                  </div>
                </motion.div>

                {selectedGoals.length === 0 && (
                  <motion.div 
                    className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Please select at least one financial goal to continue.
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 9: Financial Priorities */}
        {currentStep === 9 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(9)} text-white flex items-center justify-center font-bold`}>9</div>
                  <h2 className="text-xl font-semibold">Financial Priorities</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Rank the financial goals below in order of least acceptable to fail:
                </p>

                <div className="space-y-3 mt-4 max-h-80 overflow-y-auto pr-2">
                  {selectedGoals.map((goal, index) => {
                    const goalObj = financialGoals.find(g => g.name === goal);
                    return (
                      <motion.div 
                        key={goal} 
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.1}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-amber-500 to-amber-600`}>
                            {index + 1}
                          </div>
                          <div className="flex items-center">
                            {goalObj?.icon}
                            <span className="ml-2">{goal}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => moveGoalUp(index)} 
                            disabled={index === 0}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            ↑
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => moveGoalDown(index)} 
                            disabled={index === selectedGoals.length - 1}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            ↓
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
        {currentStep === 10 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(10)} text-white flex items-center justify-center font-bold`}>10</div>
                  <h2 className="text-xl font-semibold">Risk Preferences</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Rank the following goals in terms of the risk you are willing to take with your investments:
                </p>

                <div className="space-y-3 mt-4 max-h-80 overflow-y-auto pr-2">
                  {selectedGoals.map((goal, index) => {
                    const goalObj = financialGoals.find(g => g.name === goal);
                    return (
                      <motion.div 
                        key={goal} 
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-lime-500 to-lime-600`}>
                            {index + 1}
                          </div>
                          <div className="flex items-center">
                            {goalObj?.icon}
                            <span className="ml-2">{goal}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => moveGoalUp(index)} 
                            disabled={index === 0}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            ↑
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => moveGoalDown(index)} 
                            disabled={index === selectedGoals.length - 1}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            ↓
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
                  <h2 className="text-xl font-semibold">Investment Horizon</h2>
                </div>
                
                <motion.div 
                  className="flex items-center justify-between mb-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <span className="font-medium text-green-800">
                      Goal {currentGoalIndex + 1} of {selectedGoals.length}: 
                    </span>
                    <span className="ml-2 font-bold text-green-900">{selectedGoals[currentGoalIndex]}</span>
                    
                    {financialGoals.find(g => g.name === selectedGoals[currentGoalIndex])?.icon && (
                      <span className="ml-2">
                        {financialGoals.find(g => g.name === selectedGoals[currentGoalIndex])?.icon}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={(currentGoalIndex / (selectedGoals.length - 1)) * 100} className="w-24 h-2 bg-green-100" />
                    <span className="text-sm text-green-700">
                      {Math.round((currentGoalIndex / (selectedGoals.length - 1)) * 100)}%
                    </span>
                  </div>
                </motion.div>
                
                <p className="text-sm text-gray-600">
                  What is the timeline for this goal to materialize?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={goalHorizons[selectedGoals[currentGoalIndex]] || ''}
                  onValueChange={(value) => {
                    const newHorizons = {...goalHorizons};
                    newHorizons[selectedGoals[currentGoalIndex]] = value;
                    setGoalHorizons(newHorizons);
                  }}
                >
                  {getTimelineOptions.map((option, idx) => (
                    <motion.div 
                      key={option}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        goalHorizons[selectedGoals[currentGoalIndex]] === option ? 
                          'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option} 
                          id={`horizon-${option}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`horizon-${option}`} className="block cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
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
                  <h2 className="text-xl font-semibold">Risk Appetite</h2>
                </div>
                
                <motion.div 
                  className="flex items-center justify-between mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <span className="font-medium text-emerald-800">
                      Goal {currentGoalIndex + 1} of {selectedGoals.length}: 
                    </span>
                    <span className="ml-2 font-bold text-emerald-900">{selectedGoals[currentGoalIndex]}</span>
                    
                    {financialGoals.find(g => g.name === selectedGoals[currentGoalIndex])?.icon && (
                      <span className="ml-2">
                        {financialGoals.find(g => g.name === selectedGoals[currentGoalIndex])?.icon}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={(currentGoalIndex / (selectedGoals.length - 1)) * 100} className="w-24 h-2 bg-emerald-100" />
                    <span className="text-sm text-emerald-700">
                      {Math.round((currentGoalIndex / (selectedGoals.length - 1)) * 100)}%
                    </span>
                  </div>
                </motion.div>
                
                <p className="text-sm text-gray-600">
                  Which of the following best describes your risk appetite for the funds allocated to this goal?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.riskAppetite[selectedGoals[currentGoalIndex]] || ''}
                  onValueChange={(value) => updateGoalAnswer('riskAppetite', value)}
                >
                  {[
                    { value: "A", label: "I am risk-averse, do not want to lose my principal, and prefer to achieve stable returns." },
                    { value: "B", label: "I prefer to preserve my investments, do not want to lose my principal, but am willing to accept a certain level of income fluctuation." },
                    { value: "C", label: "I seek higher returns and growth for my capital, and am willing to accept limited losses to my principal." },
                    { value: "D", label: "I aim for high returns and am willing to bear relatively significant losses to my principal to achieve this." }
                  ].map((option, idx) => (
                    <motion.div 
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.riskAppetite[selectedGoals[currentGoalIndex]] === option.value ? 
                          'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`risk-${option.value}`} className="block cursor-pointer text-sm">
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

        {/* Step 13: Absolute Risk Tolerance */}
        {currentStep === 13 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(13)} text-white flex items-center justify-center font-bold`}>13</div>
                  <h2 className="text-xl font-semibold">Absolute Risk Tolerance</h2>
                </div>
                
                <motion.div 
                  className="flex items-center justify-between mb-4 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-100"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <span className="font-medium text-teal-800">
                      Goal {currentGoalIndex + 1} of {selectedGoals.length}: 
                    </span>
                    <span className="ml-2 font-bold text-teal-900">{selectedGoals[currentGoalIndex]}</span>
                    
                    {financialGoals.find(g => g.name === selectedGoals[currentGoalIndex])?.icon && (
                      <span className="ml-2">
                        {financialGoals.find(g => g.name === selectedGoals[currentGoalIndex])?.icon}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={(currentGoalIndex / (selectedGoals.length - 1)) * 100} className="w-24 h-2 bg-teal-100" />
                    <span className="text-sm text-teal-700">
                      {Math.round((currentGoalIndex / (selectedGoals.length - 1)) * 100)}%
                    </span>
                  </div>
                </motion.div>
                
                <p className="text-sm text-gray-600">
                  Which of the following best describes the absolute loss you could tolerate for the funds prepared for this goal?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] || ''}
                  onValueChange={(value) => updateGoalAnswer('absoluteRiskTolerance', value)}
                >
                  {[
                    { value: "A", label: "No loss of principal, but the returns fall short of expectations." },
                    { value: "B", label: "Loss of principal up to 5%." },
                    { value: "C", label: "Loss of principal between 5% and 10%." },
                    { value: "D", label: "Loss of principal between 10% and 15%." },
                    { value: "E", label: "Loss of principal between 15% and 20%." },
                    { value: "F", label: "Loss of principal exceeding 30%." }
                  ].map((option, idx) => (
                    <motion.div 
                      key={option.value}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] === option.value ? 
                          'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`abs-risk-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`abs-risk-${option.value}`} className="block cursor-pointer text-sm">
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

        {/* Step 14: Behavioral Response to Market Volatility */}
        {currentStep === 14 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(14)} text-white flex items-center justify-center font-bold`}>14</div>
                  <h2 className="text-xl font-semibold">Market Volatility Response</h2>
                </div>
                
                <p className="text-sm text-gray-600">
                  Imagine your investment portfolio drops by 20% in a short period due to market volatility. 
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
                  ].map((option, idx) => (
                    <motion.div 
                      key={option.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.15 }}
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
                        <Label htmlFor={`volatility-${option.value}`} className="block cursor-pointer text-sm">
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
                <p className="text-sm text-gray-600 mb-4">
                  Respond to the following statements using the sliders.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  {[
                    { key: "sellOnDrop", statement: "I would sell an investment if it dropped 25% in value within the first six months, even if there is a chance it could recover in the future." },
                    { key: "emotionalAttachment", statement: "I tend to feel emotionally attached to my investments, making it difficult to part with them even if it's the rational choice." },
                    { key: "preferStability", statement: "I prefer to maintain my existing investments rather than frequently buying and selling assets." },
                    { key: "hopefulRecovery", statement: "I would hesitate to sell a stock that I purchased at $50, even if it dropped to $40, hoping it will return to its original price." },
                    { key: "mentalAccounting", statement: "I tend to allocate my money into different categories based on specific financial goals rather than looking at my overall financial picture." },
                    { key: "pastInfluence", statement: "Past investment mistakes strongly influence my current investment decisions, making me overly cautious about taking risks." },
                    { key: "predictability", statement: "I believe that investment outcomes are predictable if enough information is available." },
                    { key: "profitOverPlan", statement: "The most important thing about my investments is that they make money, even if it means not following a structured plan." },
                    { key: "valueAlignment", statement: "I prefer to invest in companies that align with my personal values, such as environmental, social, or governance principles." }
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AccordionItem value={item.key} className="border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline bg-gray-50 hover:bg-gray-100 transition-colors">
                          {item.statement}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-6 bg-white">
                          <div className="pt-4">
                            <Slider 
                              value={[answers.behavioralBiases[item.key as keyof BehavioralBiases]]} 
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(value) => updateNestedAnswer('behavioralBiases', item.key, value[0])}
                              className="w-full"
                            />
                          </div>

                          <div className="flex justify-between px-2 text-sm text-gray-600 mt-2">
                            <span>Strongly Disagree</span>
                            <span>Neutral</span>
                            <span>Strongly Agree</span>
                          </div>

                          <div className={`p-3 rounded-lg mt-4 text-center text-white ${
                            answers.behavioralBiases[item.key as keyof BehavioralBiases] <= 2
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : answers.behavioralBiases[item.key as keyof BehavioralBiases] === 3
                              ? "bg-gradient-to-r from-amber-500 to-amber-600"
                              : "bg-gradient-to-r from-sky-500 to-sky-600"
                          }`}>
                            <span className="font-medium">
                              Your response: {getLikertScale(answers.behavioralBiases[item.key as keyof BehavioralBiases])}
                            </span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Navigation buttons */}
      <motion.div 
        className="flex justify-between mt-8" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="border border-gray-200 hover:bg-gray-100"
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNextStep}
          disabled={
            (currentStep === 8 && selectedGoals.length === 0) ||
            ((currentStep === 1 || currentStep === 2 || currentStep === 3 || 
              currentStep === 4 || currentStep === 5 || currentStep === 14) && 
             !answers[Object.keys(answers)[currentStep - 1] as keyof QuestionnairAnswers])
          }
          className={`${
            currentStep === 15 
              ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" 
              : "bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black"
          }`}
        >
          {currentStep === 15 ? 'Complete' : 'Continue'}
        </Button>
      </motion.div>
    </div>
  );
};

export default Questionnaire;
