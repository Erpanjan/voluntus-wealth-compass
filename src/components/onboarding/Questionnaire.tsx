import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CircleCheck, Trophy, Star, Award, GaugeCircle } from 'lucide-react';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
}

// Define financial goals
const defaultFinancialGoals = [
  'Living expenses',
  'Emergency Fund',
  'Wealth accumulation',
  'Education',
  'Legacy',
  'Buy a car',
  'Retirement',
  'Buy a house',
  'Having kids',
  'Marriage',
  'Medical & Health'
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
  }, [currentStep]);

  // Handle adding a custom financial goal
  const handleAddCustomGoal = () => {
    if (customGoal && !financialGoals.includes(customGoal)) {
      setFinancialGoals([...financialGoals, customGoal]);
      setSelectedGoals([...selectedGoals, customGoal]);
      setCustomGoal('');
    }
  };

  // Handle goal selection
  const handleGoalSelection = (goal: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedGoals([...selectedGoals, goal]);
    } else {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
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

    // Move to next step
    if (currentStep < 15) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete questionnaire
      setCompleted(true);
    }
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

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      { name: "Foundation Builder", icon: <GaugeCircle className="h-6 w-6 text-amber-500" /> },
      { name: "Financial Explorer", icon: <Star className="h-6 w-6 text-amber-500" /> },
      { name: "Investment Apprentice", icon: <Award className="h-6 w-6 text-amber-500" /> },
      { name: "Goal Hunter", icon: <Trophy className="h-6 w-6 text-amber-500" /> },
      { name: "Strategic Planner", icon: <CircleCheck className="h-6 w-6 text-amber-500" /> }
    ];
    
    // Map step ranges to achievements
    if (step >= 1 && step <= 3) return achievements[0];
    if (step >= 4 && step <= 7) return achievements[1];
    if (step >= 8 && step <= 10) return achievements[2];
    if (step >= 11 && step <= 13) return achievements[3];
    return achievements[4];
  };

  const achievement = getStepAchievement(currentStep);

  return (
    <div className="space-y-6 pb-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {achievement.icon}
            <span className="font-medium text-amber-700">{achievement.name}</span>
          </div>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Age Group */}
      {currentStep === 1 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">1</span>
                <h2 className="text-xl font-semibold">What is your age group?</h2>
              </div>

              <RadioGroup 
                className="grid gap-4"
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
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.ageGroup === option.value ? 
                        'bg-black text-white' : 
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
      )}

      {/* Step 2: Annual Income Range */}
      {currentStep === 2 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">2</span>
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.incomeRange === option.value ? 
                        'bg-black text-white' : 
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
      )}

      {/* Step 3: Net Worth */}
      {currentStep === 3 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">3</span>
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.netWorth === option.value ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Investment Knowledge */}
      {currentStep === 4 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">4</span>
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.investmentKnowledge === option.value ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Investment Experience */}
      {currentStep === 5 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">5</span>
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.investmentExperience === option.value ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Complex Products Suitability */}
      {currentStep === 6 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">6</span>
                <h2 className="text-xl font-semibold">Complex Products Suitability</h2>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    "I feel confident investing in complex financial products such as derivatives, structured notes, 
                    or leveraged instruments, even if they require advanced financial knowledge to understand the risks."
                  </p>

                  <div className="pt-4">
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

                  <div className="bg-gray-50 p-3 rounded-lg mt-4 text-center">
                    <span className="font-medium">Your response: {getLikertScale(answers.complexProducts)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 7: Investment Composition */}
      {currentStep === 7 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">7</span>
                <h2 className="text-xl font-semibold">Investment Composition</h2>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    "My current portfolio includes significant investments in a single asset class 
                    (e.g., stocks, bonds) or specific products (e.g., real estate, cryptocurrencies)"
                  </p>

                  <div className="pt-4">
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

                  <div className="bg-gray-50 p-3 rounded-lg mt-4 text-center">
                    <span className="font-medium">Your response: {getLikertScale(answers.investmentComposition)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 8: Future Expense Goals */}
      {currentStep === 8 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">8</span>
                <h2 className="text-xl font-semibold">Future Expense Goals</h2>
              </div>
              <p className="text-sm text-gray-600">
                Indicate your level of interest in the following future expense items:
              </p>

              <div className="space-y-4">
                {financialGoals.map((goal) => (
                  <div key={goal} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`goal-${goal}`} 
                      checked={selectedGoals.includes(goal)}
                      onCheckedChange={(checked) => handleGoalSelection(goal, checked === true)}
                    />
                    <Label htmlFor={`goal-${goal}`} className="cursor-pointer">{goal}</Label>
                  </div>
                ))}

                {/* Custom goal input */}
                <div className="pt-4 space-y-2">
                  <Label htmlFor="custom-goal">Add Other Financial Goal:</Label>
                  <div className="flex space-x-2">
                    <input
                      id="custom-goal"
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter a financial goal..."
                    />
                    <Button onClick={handleAddCustomGoal} type="button">Add</Button>
                  </div>
                </div>
              </div>

              {selectedGoals.length === 0 && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
                  Please select at least one financial goal to continue.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 9: Financial Priorities */}
      {currentStep === 9 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">9</span>
                <h2 className="text-xl font-semibold">Financial Priorities</h2>
              </div>
              <p className="text-sm text-gray-600">
                Rank the financial goals below in order of least acceptable to fail:
              </p>

              <div className="space-y-3 mt-4">
                {selectedGoals.map((goal, index) => (
                  <div 
                    key={goal} 
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{index + 1}</span>
                      <span>{goal}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => moveGoalUp(index)} 
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => moveGoalDown(index)} 
                        disabled={index === selectedGoals.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 10: Risk Preferences */}
      {currentStep === 10 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">10</span>
                <h2 className="text-xl font-semibold">Risk Preferences</h2>
              </div>
              <p className="text-sm text-gray-600">
                Rank the following goals in terms of the risk you are willing to take with your investments:
                <br />
                (Drag items to reorder them from highest risk tolerance to lowest)
              </p>

              <div className="space-y-3 mt-4">
                {selectedGoals.map((goal, index) => (
                  <div 
                    key={goal} 
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{index + 1}</span>
                      <span>{goal}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => moveGoalUp(index)} 
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => moveGoalDown(index)} 
                        disabled={index === selectedGoals.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 11: Investment Horizon */}
      {currentStep === 11 && selectedGoals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">11</span>
                <h2 className="text-xl font-semibold">Investment Horizon</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg">
                <span className="font-medium text-blue-800">
                  Goal {currentGoalIndex + 1} of {selectedGoals.length}: 
                  <span className="ml-2 font-bold">{selectedGoals[currentGoalIndex]}</span>
                </span>
                <span className="text-sm text-blue-600">
                  {Math.round((currentGoalIndex / selectedGoals.length) * 100)}%
                </span>
              </div>
              
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
                {getTimelineOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      goalHorizons[selectedGoals[currentGoalIndex]] === option ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 12: Risk Appetite */}
      {currentStep === 12 && selectedGoals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">12</span>
                <h2 className="text-xl font-semibold">Risk Appetite</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg">
                <span className="font-medium text-blue-800">
                  Goal {currentGoalIndex + 1} of {selectedGoals.length}: 
                  <span className="ml-2 font-bold">{selectedGoals[currentGoalIndex]}</span>
                </span>
                <span className="text-sm text-blue-600">
                  {Math.round((currentGoalIndex / selectedGoals.length) * 100)}%
                </span>
              </div>
              
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.riskAppetite[selectedGoals[currentGoalIndex]] === option.value ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 13: Absolute Risk Tolerance */}
      {currentStep === 13 && selectedGoals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">13</span>
                <h2 className="text-xl font-semibold">Absolute Risk Tolerance</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg">
                <span className="font-medium text-blue-800">
                  Goal {currentGoalIndex + 1} of {selectedGoals.length}: 
                  <span className="ml-2 font-bold">{selectedGoals[currentGoalIndex]}</span>
                </span>
                <span className="text-sm text-blue-600">
                  {Math.round((currentGoalIndex / selectedGoals.length) * 100)}%
                </span>
              </div>
              
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] === option.value ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 14: Behavioral Response to Market Volatility */}
      {currentStep === 14 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">14</span>
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
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                      answers.marketVolatilityResponse === option.value ? 
                        'bg-black text-white' : 
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
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 15: Behavioral Biases */}
      {currentStep === 15 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">15</span>
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
                  <AccordionItem key={item.key} value={item.key}>
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      {item.statement}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <Slider 
                          value={[answers.behavioralBiases[item.key]]} 
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

                      <div className="bg-gray-50 p-3 rounded-lg mt-4 text-center">
                        <span className="font-medium">
                          Your response: {getLikertScale(answers.behavioralBiases[item.key])}
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNextStep}
          disabled={
            (currentStep === 8 && selectedGoals.length === 0) ||
            ((currentStep === 1 || currentStep === 2 || currentStep === 3 || 
              currentStep === 4 || currentStep === 5 || currentStep === 14) && 
             !answers[Object.keys(answers)[currentStep - 1]])
          }
        >
          {currentStep === 15 ? 'Complete' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
