
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
import ProfileFormSection from './sections/consolidated/ProfileFormSection';
import QuestionnaireFormSection from './sections/consolidated/QuestionnaireFormSection';
import ConsultationFormSection from './sections/consolidated/ConsultationFormSection';
import OnboardingReview from './sections/consolidated/OnboardingReview';

interface ConsolidatedOnboardingProps {
  formData: OnboardingFormData;
  updateProfileData: (data: Partial<OnboardingFormData['profile']>) => void;
  updateQuestionnaireData: (data: { completed: boolean; answers: Record<string, any> }) => void;
  updateConsultationData: (data: Partial<OnboardingFormData['consultation']>) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
}

const ConsolidatedOnboarding: React.FC<ConsolidatedOnboardingProps> = ({
  formData,
  updateProfileData,
  updateQuestionnaireData,
  updateConsultationData,
  handleSubmit,
  handleSaveDraft
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handlePreview = () => {
    // Check if required fields are filled
    if (!formData.profile.firstName || !formData.profile.lastName || !formData.profile.email || !formData.profile.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before previewing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPreviewOpen(true);
  };
  
  const handleSubmitForm = () => {
    if (!formData.consultation.completed) {
      toast({
        title: "Consultation Required",
        description: "Please schedule a consultation to complete your application.",
        variant: "destructive"
      });
      return;
    }
    
    handleSubmit();
  };
  
  const handleQuestionnaireRedirect = () => {
    // Save current form data before navigating
    handleSaveDraft();
    // Navigate to questionnaire page
    navigate('/questionnaire');
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto pb-24">
      {/* Profile Section */}
      <div className="mb-16">
        <ProfileFormSection 
          profileData={formData.profile}
          updateProfileData={updateProfileData}
        />
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-gray-200 my-10"></div>
      
      {/* Questionnaire Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Financial Questionnaire</h2>
        <p className="text-gray-600 mb-8">
          Help us understand your financial goals and preferences. This information will help us provide better recommendations.
        </p>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-8">
          <p className="text-amber-700">
            This questionnaire is optional but will help us tailor our advice to your specific situation.
          </p>
        </div>
        
        <Card className="overflow-hidden border border-gray-200">
          <CardContent className="p-6">
            {formData.questionnaire.completed ? (
              <div className="flex flex-col items-center py-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-center mb-2">Questionnaire Completed</h3>
                <p className="text-gray-500 text-center mb-4">
                  Thank you for completing the financial questionnaire. Your responses will help us provide personalized financial advice.
                </p>
                <Button 
                  variant="outline"
                  onClick={handleQuestionnaireRedirect}
                  className="mt-2"
                >
                  Review Your Responses
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <h3 className="text-xl font-medium text-center mb-4">Complete the Financial Questionnaire</h3>
                <p className="text-gray-500 text-center mb-6">
                  Please take a few minutes to complete our financial questionnaire. This will help us understand your financial situation and goals better.
                </p>
                <Button 
                  onClick={handleQuestionnaireRedirect}
                  className="flex items-center gap-2"
                >
                  Go to Questionnaire <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-gray-200 my-10"></div>
      
      {/* Consultation Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Schedule a Consultation</h2>
        <p className="text-gray-600 mb-8">
          Meet with one of our advisors to discuss your financial goals and investment strategy. This step is required to activate your account.
        </p>
        
        <ConsultationFormSection
          consultationData={formData.consultation}
          updateConsultationData={updateConsultationData}
        />
      </div>
      
      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handlePreview}>
              Preview
            </Button>
            <Button onClick={handleSubmitForm}>
              Submit Application
            </Button>
          </div>
        </div>
      </div>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Review Your Application</DialogTitle>
          </DialogHeader>
          
          <OnboardingReview formData={formData} />
          
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSubmitForm}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsolidatedOnboarding;
