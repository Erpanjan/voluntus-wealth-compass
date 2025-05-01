
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ConsultationScheduling from '@/components/onboarding/ConsultationScheduling';

interface NextStepsSelectionProps {
  setCompleteConsultation: (completed: boolean) => void;
}

const NextStepsSelection: React.FC<NextStepsSelectionProps> = ({ setCompleteConsultation }) => {
  const [showConsultationScheduling, setShowConsultationScheduling] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold mb-6">Complete Your Onboarding</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Financial Questionnaire Card */}
        <div className="border rounded-lg p-6 h-full">
          <div className="flex items-start gap-4 h-full flex-col">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Financial Questionnaire</h3>
            </div>
            
            <div className="bg-amber-50 text-amber-800 px-3 py-2 rounded-md text-sm my-2 w-full">
              This questionnaire is optional and can be completed later
            </div>
            
            <p className="text-gray-600 flex-grow my-4">
              Complete our financial questionnaire to help us understand your goals and create a personalized investment strategy.
            </p>
            
            <div className="w-full">
              <Button 
                variant="secondary"
                className="flex items-center w-full md:w-auto"
                onClick={() => navigate('/questionnaire')}
              >
                Start Questionnaire
              </Button>
            </div>
          </div>
        </div>
        
        {/* Consultation Scheduling Card */}
        <div className="border rounded-lg p-6 h-full">
          <div className="flex items-start gap-4 h-full flex-col">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Consultation</h3>
            </div>
            
            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-md text-sm my-2 w-full">
              This step is required to activate your account
            </div>
            
            <p className="text-gray-600 flex-grow my-4">
              Schedule a meeting with your financial advisor to discuss your portfolio and verify your information.
            </p>
            
            <div className="w-full">
              <Button 
                variant="secondary"
                className="flex items-center w-full md:w-auto"
                onClick={() => setShowConsultationScheduling(true)}
              >
                Schedule Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showConsultationScheduling && (
        <div className="border-t my-8 pt-8">
          <div id="consultation-component">
            <ConsultationScheduling setCompleted={setCompleteConsultation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NextStepsSelection;
