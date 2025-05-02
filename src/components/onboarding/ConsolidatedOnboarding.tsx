
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ProfileFormSection from './sections/consolidated/ProfileFormSection';
import QuestionnaireFormSection from './sections/consolidated/QuestionnaireFormSection';
import ConsultationFormSection from './sections/consolidated/ConsultationFormSection';
import OnboardingReview from './sections/consolidated/OnboardingReview';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  
  // References to each section for Intersection Observer
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const questionnaireSectionRef = useRef<HTMLDivElement>(null);
  const consultationSectionRef = useRef<HTMLDivElement>(null);
  
  // Check if required profile fields are filled
  const isProfileComplete = Boolean(
    formData.profile.firstName && 
    formData.profile.lastName && 
    formData.profile.email && 
    formData.profile.phone
  );
  
  // Setup Intersection Observer for scroll tracking
  useEffect(() => {
    const options = {
      root: null, // Use viewport as root
      rootMargin: '-10% 0px -70% 0px', // Trigger when element is 10% from the top and 30% from the bottom
      threshold: 0 // Trigger when any part of the element is visible
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === profileSectionRef.current) {
            setActiveSection(0);
          } else if (entry.target === questionnaireSectionRef.current) {
            setActiveSection(1);
          } else if (entry.target === consultationSectionRef.current) {
            setActiveSection(2);
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, options);
    
    if (profileSectionRef.current) observer.observe(profileSectionRef.current);
    if (questionnaireSectionRef.current) observer.observe(questionnaireSectionRef.current);
    if (consultationSectionRef.current) observer.observe(consultationSectionRef.current);
    
    return () => {
      if (profileSectionRef.current) observer.unobserve(profileSectionRef.current);
      if (questionnaireSectionRef.current) observer.unobserve(questionnaireSectionRef.current);
      if (consultationSectionRef.current) observer.unobserve(consultationSectionRef.current);
    };
  }, [profileSectionRef.current, questionnaireSectionRef.current, consultationSectionRef.current]);
  
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-[100]">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
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
