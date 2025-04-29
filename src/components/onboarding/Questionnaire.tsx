
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
}

const Questionnaire = ({ setCompleted }: QuestionnaireProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [answers, setAnswers] = useState({
    // Level 1
    ageGroup: '',
    incomeRange: [50000],
    netWorth: [100000],
    // Level 2
    investmentExperience: '',
    knowledgeLevel: [3],
    // Level 3
    primaryGoal: '',
    timeHorizon: '',
    // Level 4
    riskTolerance: [5],
    marketDownReaction: '',
    // Level 5
    investmentApproach: '',
    marketBelief: ''
  });

  const handleSliderChange = (name: string, value: number[]) => {
    setAnswers({
      ...answers,
      [name]: value
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setAnswers({
      ...answers,
      [name]: value
    });
  };

  const handleNextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
    } else {
      // Questionnaire complete
      setCompleted(true);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Financial Questionnaire</h1>
      <p className="text-lg mb-8">
        Help us understand your financial situation and goals better. This questionnaire will guide our investment strategy for you.
      </p>

      {/* Progress indicator */}
      <div className="flex mb-8">
        {[1, 2, 3, 4, 5].map(level => (
          <div 
            key={level} 
            className={`flex-1 py-2 text-center font-medium ${
              level === currentLevel 
                ? 'bg-black text-white' 
                : level < currentLevel 
                  ? 'bg-gray-300 text-black' 
                  : 'bg-gray-100 text-gray-500'
            }`}
          >
            Level {level}
          </div>
        ))}
      </div>

      {/* Level 1 - Getting to Know You */}
      {currentLevel === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Level 1: Getting to Know You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>What is your age group?</Label>
              <RadioGroup 
                value={answers.ageGroup} 
                onValueChange={(value) => handleRadioChange('ageGroup', value)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="18-30" id="age-18-30" />
                  <Label htmlFor="age-18-30">18-30 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="31-45" id="age-31-45" />
                  <Label htmlFor="age-31-45">31-45 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="46-60" id="age-46-60" />
                  <Label htmlFor="age-46-60">46-60 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60+" id="age-60+" />
                  <Label htmlFor="age-60+">60+ years</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>What is your annual income range?</Label>
              <div className="pt-6 pb-2">
                <Slider 
                  value={answers.incomeRange} 
                  min={0} 
                  max={500000} 
                  step={10000} 
                  onValueChange={(value) => handleSliderChange('incomeRange', value)}
                />
              </div>
              <div className="text-right font-medium">
                {formatCurrency(answers.incomeRange[0])}
              </div>
            </div>

            <div className="space-y-4">
              <Label>What is your estimated net worth?</Label>
              <div className="pt-6 pb-2">
                <Slider 
                  value={answers.netWorth} 
                  min={0} 
                  max={2000000} 
                  step={50000} 
                  onValueChange={(value) => handleSliderChange('netWorth', value)}
                />
              </div>
              <div className="text-right font-medium">
                {formatCurrency(answers.netWorth[0])}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level 2 - Your Investment Story */}
      {currentLevel === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Level 2: Your Investment Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>What is your investment experience?</Label>
              <RadioGroup 
                value={answers.investmentExperience} 
                onValueChange={(value) => handleRadioChange('investmentExperience', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="exp-none" />
                  <Label htmlFor="exp-none">No experience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="exp-beginner" />
                  <Label htmlFor="exp-beginner">Beginner (less than 2 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="exp-intermediate" />
                  <Label htmlFor="exp-intermediate">Intermediate (2-5 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experienced" id="exp-experienced" />
                  <Label htmlFor="exp-experienced">Experienced (5+ years)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>How would you rate your investment knowledge? (1-10)</Label>
              <div className="pt-6 pb-2">
                <Slider 
                  value={answers.knowledgeLevel} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleSliderChange('knowledgeLevel', value)}
                />
              </div>
              <div className="flex justify-between">
                <span>Beginner</span>
                <span className="font-medium">{answers.knowledgeLevel[0]}</span>
                <span>Expert</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level 3 - Dreaming Big */}
      {currentLevel === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Level 3: Dreaming Big</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>What is your primary financial goal?</Label>
              <RadioGroup 
                value={answers.primaryGoal} 
                onValueChange={(value) => handleRadioChange('primaryGoal', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retirement" id="goal-retirement" />
                  <Label htmlFor="goal-retirement">Retirement planning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="education" id="goal-education" />
                  <Label htmlFor="goal-education">Education funding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wealth" id="goal-wealth" />
                  <Label htmlFor="goal-wealth">Wealth accumulation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="legacy" id="goal-legacy" />
                  <Label htmlFor="goal-legacy">Legacy planning</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>What is your investment time horizon?</Label>
              <RadioGroup 
                value={answers.timeHorizon} 
                onValueChange={(value) => handleRadioChange('timeHorizon', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="time-short" />
                  <Label htmlFor="time-short">Short-term (0-3 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="time-medium" />
                  <Label htmlFor="time-medium">Medium-term (3-7 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="time-long" />
                  <Label htmlFor="time-long">Long-term (7-15 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-long" id="time-very-long" />
                  <Label htmlFor="time-very-long">Very long-term (15+ years)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level 4 - Facing the Unknown */}
      {currentLevel === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Level 4: Facing the Unknown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>What is your risk tolerance? (1-10)</Label>
              <div className="pt-6 pb-2">
                <Slider 
                  value={answers.riskTolerance} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleSliderChange('riskTolerance', value)}
                />
              </div>
              <div className="flex justify-between">
                <span>Conservative</span>
                <span className="font-medium">{answers.riskTolerance[0]}</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label>How would you react if your investments dropped 20% in value?</Label>
              <RadioGroup 
                value={answers.marketDownReaction} 
                onValueChange={(value) => handleRadioChange('marketDownReaction', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="reaction-sell" />
                  <Label htmlFor="reaction-sell">Sell everything to prevent further losses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell-some" id="reaction-sell-some" />
                  <Label htmlFor="reaction-sell-some">Sell some investments to reduce risk</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hold" id="reaction-hold" />
                  <Label htmlFor="reaction-hold">Hold and wait for recovery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="reaction-buy" />
                  <Label htmlFor="reaction-buy">Buy more at the lower prices</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level 5 - How You Think */}
      {currentLevel === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Level 5: How You Think</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Which investment approach resonates with you most?</Label>
              <RadioGroup 
                value={answers.investmentApproach} 
                onValueChange={(value) => handleRadioChange('investmentApproach', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passive" id="approach-passive" />
                  <Label htmlFor="approach-passive">Passive investing with minimal adjustments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="approach-active" />
                  <Label htmlFor="approach-active">Active management with regular adjustments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advisor" id="approach-advisor" />
                  <Label htmlFor="approach-advisor">Complete reliance on advisor recommendations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="approach-hybrid" />
                  <Label htmlFor="approach-hybrid">Hybrid approach combining multiple strategies</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Which statement best describes your belief about markets?</Label>
              <RadioGroup 
                value={answers.marketBelief} 
                onValueChange={(value) => handleRadioChange('marketBelief', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="efficient" id="belief-efficient" />
                  <Label htmlFor="belief-efficient">Markets are efficient and difficult to beat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inefficient" id="belief-inefficient" />
                  <Label htmlFor="belief-inefficient">Markets have inefficiencies that can be exploited</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cycles" id="belief-cycles" />
                  <Label htmlFor="belief-cycles">Markets move in predictable cycles</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unpredictable" id="belief-unpredictable" />
                  <Label htmlFor="belief-unpredictable">Markets are largely unpredictable</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevLevel}
          disabled={currentLevel === 1}
        >
          Back
        </Button>

        <Button onClick={handleNextLevel}>
          {currentLevel === 5 ? 'Complete Questionnaire' : 'Next Level'}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
