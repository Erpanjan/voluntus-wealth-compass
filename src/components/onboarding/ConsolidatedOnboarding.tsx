
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import ProfileFormSection from './sections/consolidated/ProfileFormSection';
import QuestionnaireFormSection from './sections/consolidated/QuestionnaireFormSection';
import ConsultationFormSection from './sections/consolidated/ConsultationFormSection';
import { useSectionTracking } from '@/hooks/use-section-tracking';
import BottomActionBar from './components/BottomActionBar';
import PreviewDialog from './components/PreviewDialog';

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
  
  // Get section refs and tracking from custom hook
  const { 
    activeSection,
    profileSectionRef,
    questionnaireSectionRef,
    consultationSectionRef
  } = useSectionTracking();
  
  // Check if required profile fields are filled
  const isProfileComplete = Boolean(
    formData.profile.firstName && 
    formData.profile.lastName && 
    formData.profile.email && 
    formData.profile.phone
  );
  
  const handlePreview = () => {
    // Check if required fields are filled
    if (!isProfileComplete) {
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
  
  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Main content area */}
        <div className="flex-1 max-w-3xl mx-auto">
          {/* Profile Section */}
          <div ref={profileSectionRef} className="mb-16 md:mb-20 animate-fade-in scroll-mt-24">
            <ProfileFormSection 
              profileData={formData.profile}
              updateProfileData={updateProfileData}
            />
          </div>
          
          {/* Questionnaire Section */}
          <div ref={questionnaireSectionRef} className="mb-16 md:mb-20 animate-fade-in scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-6">Financial Questionnaire</h2>
            <p className="text-gray-600 mb-8">
              This questionnaire is designed to help us understand your financial circumstances and investment goals. While completing it is optional at this stage, it will be required before we can officially begin our service. You're welcome to skip it for now and return to it during consultation.
            </p>
            
            <QuestionnaireFormSection
              questionnaireData={formData.questionnaire}
              updateQuestionnaireData={updateQuestionnaireData}
            />
          </div>
          
          {/* Consultation Section */}
          <div ref={consultationSectionRef} className="animate-fade-in scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-6">Schedule a Consultation</h2>
            <p className="text-gray-600 mb-8">
              Meet with one of our advisors for an in-depth discussion of your financial situation. We'll also use this session to verify key details and better understand your needs.
            </p>
            
            <ConsultationFormSection
              consultationData={formData.consultation}
              updateConsultationData={updateConsultationData}
            />
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom Action Bar */}
      <BottomActionBar
        handleSaveDraft={handleSaveDraft}
        handlePreview={handlePreview}
        handleSubmit={handleSubmitForm}
      />
      
      {/* Preview Dialog */}
      <PreviewDialog
        isOpen={isPreviewOpen}
        setIsOpen={setIsPreviewOpen}
        formData={formData}
        handleSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default ConsolidatedOnboarding;
