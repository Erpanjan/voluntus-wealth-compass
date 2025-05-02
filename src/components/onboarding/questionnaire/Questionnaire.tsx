import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { PiggyBank, CircleCheck, BarChart3, BookOpen, Landmark, Car, Sparkles, Home, Heart, Star } from 'lucide-react';
import { QuestionnaireProvider, useQuestionnaire } from './QuestionnaireContext';
import { AchievementNotification } from './components/AchievementNotification';
import { QuestionnaireHeader } from './components/QuestionnaireHeader';
import { QuestionnaireBehavioralSection } from './components/QuestionnaireBehavioralSection';
import { QuestionCard } from './components/QuestionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
}

// Main component wrapper
const Questionnaire: React.FC<QuestionnaireProps> = ({ setCompleted }) => {
  return (
    <QuestionnaireProvider setCompleted={setCompleted}>
      <QuestionnaireContent />
    </QuestionnaireProvider>
  );
};

// Internal content component that uses the context
const QuestionnaireContent: React.FC = () => {
  const {
    currentStep,
    progress,
    animateStep,
    answers,
    updateAnswer,
    handleNextStep,
    handlePrevStep,
    setFinancialGoals,
    getLikertScale,
    getNumberedBackground,
    updateNestedAnswer,
    updateGoalAnswer,
    selectedGoals,
    currentGoalIndex
  } = useQuestionnaire();

  // Initialize financial goals
  useEffect(() => {
    setFinancialGoals(defaultFinancialGoals);
  }, []);

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

  return (
    <div className="space-y-6 pb-8">
      {/* Achievement Notification */}
      <AchievementNotification />
      
      {/* Progress Indicator & Points */}
      <QuestionnaireHeader />

      {/* Question Container with Animation */}
      <motion.div
        initial="hidden"
        animate={animateStep ? "visible" : "hidden"}
        variants={scaleIn}
        key={`step-${currentStep}`}
        className="mb-6"
      >
        {/* Step 1: Age Group */}
        {currentStep === 1 && (
          <QuestionCard
            questionNumber={1}
            title="What is your age group?"
            options={[
              { value: "18-25", label: "18–25 years old" },
              { value: "26-50", label: "26–50 years old" },
              { value: "51-60", label: "51–60 years old" },
              { value: "61-64", label: "61–64 years old" },
              { value: "65+", label: "65 years old or above" }
            ]}
            answerKey="ageGroup"
          />
        )}

        {/* Step 2: Annual Income Range */}
        {currentStep === 2 && (
          <QuestionCard
            questionNumber={2}
            title="What is your average annual income range (in HKD)?"
            description="Includes wages, salaries, business income, interest, financial asset income, rental income, and other non-financial asset income."
            options={[
              { value: "below100k", label: "Below HKD 100,000" },
              { value: "200k-500k", label: "HKD 200,000 – HKD 500,000" },
              { value: "500k-1m", label: "HKD 500,000 – HKD 1,000,000" },
              { value: "1m-2m", label: "HKD 1,000,000 – HKD 2,000,000" },
              { value: "above2m", label: "Above HKD 2,000,000" }
            ]}
            answerKey="incomeRange"
          />
        )}

        {/* Step 3: Net Worth */}
        {currentStep === 3 && (
          <QuestionCard
            questionNumber={3}
            title="What is your total personal net worth (in HKD)?"
            description="Including residential properties and operational business assets, cash deposits, stocks, bonds, insurance, and physical asset investments, after deducting liabilities such as mortgage loans, credit card debt, etc."
            options={[
              { value: "below1.5m", label: "Below HKD 1,500,000" },
              { value: "1.5m-5m", label: "HKD 1,500,000 – HKD 5,000,000" },
              { value: "5m-10m", label: "HKD 5,000,000 – HKD 10,000,000" },
              { value: "10m-100m", label: "HKD 10,000,000 – HKD 100,000,000" },
              { value: "above100m", label: "Above HKD 100,000,000" }
            ]}
            answerKey="netWorth"
          />
        )}

        {/* Step 4: Investment Knowledge */}
        {currentStep === 4 && (
          <QuestionCard
            questionNumber={4}
            title="Investment Knowledge and Experience"
            description="Which of the following best describes your investment knowledge and experience?"
            options={[
              { value: "A", label: "Apart from saving deposits, government bonds, and money market funds, I do not invest in other financial products. My investment knowledge is relatively limited." },
              { value: "B", label: "Most of my investments are in savings deposits, government bonds, and money market funds, with limited investments in stocks, mutual funds, and riskier products. My investment knowledge is somewhat limited." },
              { value: "C", label: "My investments are diversified across savings, government bonds, trust products, stocks, and mutual funds. I have a certain level of investment knowledge." },
              { value: "D", label: "Most of my investments are in stocks, mutual funds, forex, and other higher-risk products, with limited investments in savings, government bonds, and money market funds. I have advanced investment knowledge." }
            ]}
            answerKey="investmentKnowledge"
            animationDelay={0.15}
          />
        )}

        {/* Step 5: Investment Experience */}
        {currentStep === 5 && (
          <QuestionCard
            questionNumber={5}
            title="Investment Experience"
            description="How many years of experience do you have investing in stocks, mutual funds (excluding money market funds), forex, and other higher-risk financial products?"
            options={[
              { value: "A", label: "No experience" },
              { value: "B", label: "Some experience, but less than 2 years" },
              { value: "C", label: "Between 2 years and 5 years" },
              { value: "D", label: "Between 5 years and 8 years" },
              { value: "E", label: "More than 8 years" }
            ]}
            answerKey="investmentExperience"
          />
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
                      "My investment portfolio is well-diversified across different asset classes, industries, and geographic regions."
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

        {/* Step 8: Select Financial Goals */}
        {currentStep === 8 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(8)} text-white flex items-center justify-center font-bold`}>8</div>
                  <h2 className="text-xl font-semibold">Select Your Financial Goals</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Select the financial goals that are most important to you.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {defaultFinancialGoals.map((goal) => (
                    <motion.div 
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-amber-500 focus:ring-0"
                          value={goal.name}
                          checked={selectedGoals.includes(goal.name)}
                          onChange={(e) => {
                            updateNestedAnswer('riskAppetite', goal.name, '');
                            updateNestedAnswer('absoluteRiskTolerance', goal.name, '');
                            updateAnswer('selectedGoals', e.target.checked ? [...selectedGoals, goal.name] : selectedGoals.filter(g => g !== goal.name));
                          }}
                        />
                        <span className="flex items-center space-x-2">
                          {goal.icon}
                          <span>{goal.name}</span>
                        </span>
                      </label>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="text"
                      placeholder="Add a custom goal"
                      className="flex-grow"
                    />
                    <Button>Add Goal</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 9: Prioritize Goals */}
        {currentStep === 9 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(9)} text-white flex items-center justify-center font-bold`}>9</div>
                  <h2 className="text-xl font-semibold">Prioritize Your Goals</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Rank your selected goals in order of importance.
                </p>

                {selectedGoals.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {selectedGoals.map((goal, index) => (
                      <li key={goal} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg">
                        <span>{index + 1}. {goal}</span>
                        <div className="space-x-2">
                          <Button variant="outline" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="M12 5v14M3 14l9-9 9 9"/></svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="M12 19V5M3 10l9 9 9-9"/></svg>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No goals selected. Please go back to select your financial goals.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 10: Risk Appetite */}
        {currentStep === 10 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(10)} text-white flex items-center justify-center font-bold`}>10</div>
                  <h2 className="text-xl font-semibold">Risk Appetite</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  How would you describe your general attitude towards taking risks with your investments?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.marketVolatilityResponse} 
                  onValueChange={(value) => updateAnswer('marketVolatilityResponse', value)}
                >
                  {[
                    { value: "conservative", label: "Conservative - I prefer investments with minimal risk, even if it means lower returns." },
                    { value: "moderate", label: "Moderate - I am willing to take some risks to achieve higher returns, but I still prioritize capital preservation." },
                    { value: "aggressive", label: "Aggressive - I am comfortable with higher levels of risk in pursuit of significant returns." }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.marketVolatilityResponse === option.value ? 
                          'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`risk-${option.value}`} className="block cursor-pointer">
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

        {/* Step 11: Goal-Specific Risk Appetite */}
        {currentStep === 11 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(11)} text-white flex items-center justify-center font-bold`}>11</div>
                  <h2 className="text-xl font-semibold">Risk Appetite for {selectedGoals[currentGoalIndex]}</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  How much risk are you willing to take to achieve this specific goal?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.riskAppetite[selectedGoals[currentGoalIndex]] || ''}
                  onValueChange={(value) => updateGoalAnswer('riskAppetite', value)}
                >
                  {[
                    { value: "low", label: "Low - I want to minimize the risk of losing money, even if it means lower potential returns." },
                    { value: "medium", label: "Medium - I am willing to take some risk to potentially earn higher returns." },
                    { value: "high", label: "High - I am comfortable with significant risk to maximize potential returns." }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.riskAppetite[selectedGoals[currentGoalIndex]] === option.value ? 
                          'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`risk-${option.value}`} className="block cursor-pointer">
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

        {/* Step 12: Absolute Risk Tolerance */}
        {currentStep === 12 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(12)} text-white flex items-center justify-center font-bold`}>12</div>
                  <h2 className="text-xl font-semibold">Absolute Risk Tolerance for {selectedGoals[currentGoalIndex]}</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  What is the maximum percentage loss you are willing to tolerate in a single year for this goal?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] || ''}
                  onValueChange={(value) => updateGoalAnswer('absoluteRiskTolerance', value)}
                >
                  {[
                    { value: "5", label: "5% or less" },
                    { value: "10", label: "10%" },
                    { value: "15", label: "15%" },
                    { value: "20", label: "20% or more" }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] === option.value ? 
                          'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-tolerance-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`risk-tolerance-${option.value}`} className="block cursor-pointer">
                          {option.label}%
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 13: Investment Timeline */}
        {currentStep === 13 && selectedGoals.length > 0 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(13)} text-white flex items-center justify-center font-bold`}>13</div>
                  <h2 className="text-xl font-semibold">Investment Timeline for {selectedGoals[currentGoalIndex]}</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  When do you plan to start using the funds for this goal?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] || ''}
                  onValueChange={(value) => updateGoalAnswer('absoluteRiskTolerance', value)}
                >
                  {[
                    { value: "1", label: "Less than 1 year" },
                    { value: "3", label: "1 to 3 years" },
                    { value: "7", label: "4 to 7 years" },
                    { value: "15", label: "8 to 15 years" },
                    { value: "16", label: "More than 15 years" }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.value} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${
                        answers.absoluteRiskTolerance[selectedGoals[currentGoalIndex]] === option.value ? 
                          'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md' : 
                          'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <RadioGroupItem 
                          value={option.value} 
                          id={`risk-tolerance-${option.value}`} 
                          className="sr-only"
                        />
                        <Label htmlFor={`risk-tolerance-${option.value}`} className="block cursor-pointer">
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

        {/* Step 14: Market Volatility Response */}
        {currentStep === 14 && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getNumberedBackground(14)} text-white flex items-center justify-center font-bold`}>14</div>
                  <h2 className="text-xl font-semibold">Response to Market Volatility</h2>
                </div>
                
                <p className="text-gray-600 text-sm">
                  How do you typically react when the stock market experiences a significant downturn?
                </p>

                <RadioGroup 
                  className="grid gap-4"
                  value={answers.marketVolatilityResponse} 
                  onValueChange={(value) => updateAnswer('marketVolatilityResponse', value)}
                >
                  {[
                    { value: "panic", label: "I panic and sell my investments to avoid further losses." },
                    { value: "concerned", label: "I become concerned but hold onto my investments, hoping for a recovery." },
                    { value: "opportunity", label: "I see it as an opportunity to buy more investments at lower prices." }
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
          <QuestionnaireBehavioralSection />
        )}

        {/* Other steps would be implemented similarly */}
        {/* For brevity, steps 6-14 are omitted but would follow the same pattern */}
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
