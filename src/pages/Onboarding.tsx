
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { useOnboardingForm } from '@/hooks/use-onboarding-form';

// Import section components
import ProfileSection from '@/components/onboarding/sections/ProfileSection';
import QuestionnaireSection from '@/components/onboarding/sections/QuestionnaireSection';
import ConsultationSection from '@/components/onboarding/sections/ConsultationSection';
import ReviewSection from '@/components/onboarding/sections/ReviewSection';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Section refs for manual navigation
  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    questionnaire: useRef<HTMLDivElement>(null),
    consultation: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
  };

  // Current active section
  const [activeSection, setActiveSection] = React.useState<string>('profile');
  
  // Get form data and update methods from the custom hook
  const { formData, updateProfileData, updateQuestionnaireData, updateConsultationData } = useOnboardingForm();

  // Handle saving draft explicitly
  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your information has been saved. You can return to complete it later.",
    });
  };

  // Handle navigation between sections
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    sectionRefs[section as keyof typeof sectionRefs]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Handle final submission
  const handleSubmit = () => {
    if (!formData.consultation.completed) {
      toast({
        title: "Required Step",
        description: "Please schedule a consultation to proceed.",
        variant: "destructive"
      });
      navigateToSection('consultation');
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your application is now pending approval. We'll notify you when it's approved.",
    });
    
    // Clear draft data and move to approval
    localStorage.removeItem('onboardingDraft');
    
    // For demo purposes, simulate immediate approval
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={0} />

      {/* Section Navigation - using OnboardingSectionNavigation from the previous code */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between overflow-x-auto py-3">
            {[
              { id: 'profile', name: 'Profile', isComplete: formData.profile.firstName && formData.profile.lastName },
              { id: 'questionnaire', name: 'Questionnaire', isComplete: formData.questionnaire.completed },
              { id: 'consultation', name: 'Consultation', isComplete: formData.consultation.completed },
              { id: 'review', name: 'Review & Submit', isComplete: false },
            ].map((section, index) => (
              <button
                key={section.id}
                onClick={() => navigateToSection(section.id)}
                className={`flex flex-col items-center min-w-[100px] px-2 py-1 transition-colors relative ${
                  activeSection === section.id ? "text-black" : "text-gray-500"
                }`}
              >
                <div className="flex items-center mb-1">
                  {section.isComplete ? (
                    <span className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center mr-1">
                      <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  ) : (
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-1 ${
                      activeSection === section.id ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {index + 1}
                    </span>
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">{section.name}</span>
                </div>
                <div className={`h-0.5 w-full absolute bottom-0 ${
                  activeSection === section.id ? "bg-black" : "bg-transparent"
                }`} />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8 mb-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <div ref={sectionRefs.profile} id="profile-section" className="mb-16">
            <ProfileSection 
              profileData={formData.profile} 
              updateProfileData={updateProfileData} 
              navigateToNext={() => navigateToSection('questionnaire')} 
              handleSaveDraft={handleSaveDraft}
            />
          </div>
          
          {/* Questionnaire Section */}
          <div ref={sectionRefs.questionnaire} id="questionnaire-section" className="mb-16">
            <QuestionnaireSection 
              questionnaireData={formData.questionnaire}
              updateQuestionnaireData={updateQuestionnaireData}
              navigateToNext={() => navigateToSection('consultation')}
              navigateToPrev={() => navigateToSection('profile')}
              handleSaveDraft={handleSaveDraft}
            />
          </div>
          
          {/* Consultation Section */}
          <div ref={sectionRefs.consultation} id="consultation-section" className="mb-16">
            <ConsultationSection 
              consultationData={formData.consultation}
              updateConsultationData={updateConsultationData}
              navigateToNext={() => navigateToSection('review')}
              navigateToPrev={() => navigateToSection('questionnaire')}
              handleSaveDraft={handleSaveDraft}
            />
          </div>
          
          {/* Review Section */}
          <div ref={sectionRefs.review} id="review-section">
            <ReviewSection 
              formData={formData}
              navigateTo={navigateToSection}
              handleSubmit={handleSubmit}
              handleSaveDraft={handleSaveDraft}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
