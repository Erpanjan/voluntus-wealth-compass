
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalQuestions = 15;

  // Handle radio button selections
  const handleRadioChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle slider value changes
  const handleSliderChange = (questionId: number, value: number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Questionnaire Submitted",
        description: "Thank you for completing the financial questionnaire.",
      });
      
      setIsSubmitting(false);
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-4 bg-white">
        <div className="container mx-auto px-6">
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={() => navigate('/onboarding')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Onboarding
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Financial Questionnaire</h1>
            <p className="text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </p>
            <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-black h-full" 
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Question 1 */}
              {currentQuestion === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">1. What is your age group?</h2>
                  <RadioGroup 
                    value={answers[1] || ''} 
                    onValueChange={(value) => handleRadioChange(1, value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="age-A" />
                      <Label htmlFor="age-A">18–25 years old</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="age-B" />
                      <Label htmlFor="age-B">26–50 years old</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="age-C" />
                      <Label htmlFor="age-C">51–60 years old</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="age-D" />
                      <Label htmlFor="age-D">61–64 years old</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="E" id="age-E" />
                      <Label htmlFor="age-E">65 years old or above</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 2 */}
              {currentQuestion === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    2. In the past three years, what is your average annual income range (converted into HKD)?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Includes wages, salaries, and business income, interest, financial asset income, rental income, and other non-financial asset income
                  </p>
                  <RadioGroup 
                    value={answers[2] || ''} 
                    onValueChange={(value) => handleRadioChange(2, value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="income-A" />
                      <Label htmlFor="income-A">Below HKD 100,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="income-B" />
                      <Label htmlFor="income-B">HKD 200,000 (inclusive) – HKD 500,000 (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="income-C" />
                      <Label htmlFor="income-C">HKD 500,000 (exclusive) – HKD 1,000,000 (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="income-D" />
                      <Label htmlFor="income-D">HKD 1,000,000 (exclusive) – HKD 2,000,000 (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="E" id="income-E" />
                      <Label htmlFor="income-E">Above HKD 2,000,000</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 3 */}
              {currentQuestion === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    3. What is your total personal net worth (converted into HKD)?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Including residential properties and operational business assets but includes cash deposits, stocks, bonds, insurance, and physical asset investments, after deducting liabilities such as mortgage loans, credit card debt, etc.
                  </p>
                  <RadioGroup 
                    value={answers[3] || ''} 
                    onValueChange={(value) => handleRadioChange(3, value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="worth-A" />
                      <Label htmlFor="worth-A">Below HKD 1,500,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="worth-B" />
                      <Label htmlFor="worth-B">HKD 1,500,000 (inclusive) – HKD 5,000,000 (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="worth-C" />
                      <Label htmlFor="worth-C">HKD 5,000,000 (exclusive) – HKD 10,000,000 (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="worth-D" />
                      <Label htmlFor="worth-D">HKD 10,000,000 (exclusive) – HKD 100,000,000 (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="E" id="worth-E" />
                      <Label htmlFor="worth-E">Above HKD 100,000,000</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 4 */}
              {currentQuestion === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    4. Investment Knowledge and Experience
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Which of the following best describes your investment knowledge and experience?
                  </p>
                  <RadioGroup 
                    value={answers[4] || ''} 
                    onValueChange={(value) => handleRadioChange(4, value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="knowledge-A" />
                      <Label htmlFor="knowledge-A">
                        Apart from saving deposits, government bonds, and money market funds, I do not invest in other financial products. My investment knowledge is relatively limited.
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="knowledge-B" />
                      <Label htmlFor="knowledge-B">
                        Most of my investments are in savings deposits, government bonds, and money market funds, with limited investments in stocks, mutual funds, and riskier products. My investment knowledge is somewhat limited.
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="knowledge-C" />
                      <Label htmlFor="knowledge-C">
                        My investments are diversified across savings, government bonds, trust products, stocks, and mutual funds. I have a certain level of investment knowledge.
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="knowledge-D" />
                      <Label htmlFor="knowledge-D">
                        Most of my investments are in stocks, mutual funds, forex, and other higher-risk products, with limited investments in savings, government bonds, and money market funds. I have advanced investment knowledge.
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 5 */}
              {currentQuestion === 5 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    5. Investment Experience
                  </h2>
                  <p className="text-gray-600 mb-6">
                    How many years of experience do you have investing in stocks, mutual funds (excluding money market funds), forex, and other higher-risk financial products?
                  </p>
                  <RadioGroup 
                    value={answers[5] || ''} 
                    onValueChange={(value) => handleRadioChange(5, value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="experience-A" />
                      <Label htmlFor="experience-A">No experience</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="experience-B" />
                      <Label htmlFor="experience-B">Some experience, but less than 2 years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="experience-C" />
                      <Label htmlFor="experience-C">Between 2 years (inclusive) and 5 years (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="experience-D" />
                      <Label htmlFor="experience-D">Between 5 years (inclusive) and 8 years (inclusive)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="E" id="experience-E" />
                      <Label htmlFor="experience-E">More than 8 years (exclusive)</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Question 6 - Complex Products Suitability */}
              {currentQuestion === 6 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    6. Complex Products Suitability
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Respond to the following statement using the slider:
                  </p>
                  <div className="mb-6">
                    <p className="mb-2 font-medium">
                      "I feel confident investing in complex financial products such as derivatives, structured notes, or leveraged instruments, even if they require advanced financial knowledge to understand the risks."
                    </p>
                    <div className="mt-6">
                      <Slider
                        value={answers[6] || [3]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(value) => handleSliderChange(6, value)}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>Strongly Disagree</span>
                        <span>Disagree</span>
                        <span>Neutral</span>
                        <span>Agree</span>
                        <span>Strongly Agree</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* For demonstration purposes, showing only the first 6 questions */}
              {currentQuestion > 6 && currentQuestion < 15 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Question {currentQuestion}</h2>
                  <p className="text-gray-600 mb-6">
                    This question would show more detailed content as specified in the requirements.
                  </p>
                </div>
              )}

              {/* Final question */}
              {currentQuestion === 15 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">15. Behavioral Biases</h2>
                  <p className="text-gray-600 mb-6">
                    Respond to the following statements using a sliding scale:
                  </p>
                  <div className="space-y-8">
                    <div>
                      <p className="mb-2">
                        "I would sell an investment if it dropped 25% in value within the first six months, even if there is a chance it could recover in the future."
                      </p>
                      <div className="mt-6">
                        <Slider
                          value={answers[151] || [3]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => handleSliderChange(151, value)}
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="mb-2">
                        "I tend to feel emotionally attached to my investments, making it difficult to part with them even if it's the rational choice."
                      </p>
                      <div className="mt-6">
                        <Slider
                          value={answers[152] || [3]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => handleSliderChange(152, value)}
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestion === 1}
            >
              Previous
            </Button>
            
            {currentQuestion < totalQuestions ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
