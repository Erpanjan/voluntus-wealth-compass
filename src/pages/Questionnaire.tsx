
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import OnboardingProgressIndicator from '@/components/onboarding/OnboardingProgressIndicator';
import { useToast } from '@/hooks/use-toast';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle saving the questionnaire state to localStorage
  const handleSave = () => {
    // Get existing data from localStorage if it exists
    const savedData = localStorage.getItem('onboardingDraft');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const updatedData = {
        ...parsedData,
        questionnaire: {
          ...parsedData.questionnaire,
          completed: true
        }
      };
      localStorage.setItem('onboardingDraft', JSON.stringify(updatedData));
    }

    // Show success message
    toast({
      title: "Questionnaire Skipped",
      description: "You can always come back to complete the questionnaire later.",
    });
    
    // Navigate back to onboarding
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        className="border-b py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => navigate('/onboarding')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Onboarding
            </Button>
          </div>
          <OnboardingProgressIndicator currentStep={0} totalSteps={1} />
        </div>
      </motion.header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl font-semibold mb-2">Financial Questionnaire</h1>
            <p className="text-gray-600">This questionnaire is currently being updated.</p>
          </motion.div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">
                  The questionnaire is optional and not required to complete your application.
                  You may skip it now and come back later if you wish.
                </p>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  Skip and Return to Onboarding
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
