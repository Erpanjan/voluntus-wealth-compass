
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';

// Import section components
import ProfileSection from '@/components/onboarding/sections/ProfileSection';
import QuestionnaireSection from '@/components/onboarding/sections/QuestionnaireSection';
import ConsultationSection from '@/components/onboarding/sections/ConsultationSection';
import ReviewSection from '@/components/onboarding/sections/ReviewSection';
import OnboardingSectionNavigation from '@/components/onboarding/sections/OnboardingSectionNavigation';

// Types for our form state
interface OnboardingFormData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredCommunication: string;
    mediaAccountNumber: string;
    address: string;
    imageUrl: string | null;
  };
  questionnaire: {
    completed: boolean;
    answers: Record<string, any>;
  };
  consultation: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // References to scroll to sections
  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    questionnaire: useRef<HTMLDivElement>(null),
    consultation: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
  };

  // Current active section
  const [activeSection, setActiveSection] = useState<string>('profile');
  
  // Initialize form data
  const initialFormData: OnboardingFormData = {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredCommunication: '',
      mediaAccountNumber: '',
      address: '',
      imageUrl: null,
    },
    questionnaire: {
      completed: false,
      answers: {},
    },
    consultation: {
      completed: false,
      type: '',
      date: '',
      time: '',
    },
  };

  // Form data state with localStorage persistence
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    const savedData = localStorage.getItem('onboardingDraft');
    return savedData ? JSON.parse(savedData) : initialFormData;
  });

  // Update localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('onboardingDraft', JSON.stringify(formData));
  }, [formData]);

  // Handle saving draft explicitly
  const handleSaveDraft = () => {
    localStorage.setItem('onboardingDraft', JSON.stringify(formData));
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

  // Update individual form sections
  const updateProfileData = (profileData: Partial<OnboardingFormData['profile']>) => {
    setFormData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileData }
    }));
  };

  const updateQuestionnaireData = (data: { completed: boolean; answers: Record<string, any> }) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: { ...data }
    }));
  };

  const updateConsultationData = (consultationData: Partial<OnboardingFormData['consultation']>) => {
    setFormData(prev => ({
      ...prev,
      consultation: { ...prev.consultation, ...consultationData }
    }));
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
    
    // In a real application, we would submit to the backend here
    
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

      {/* Section Navigation */}
      <OnboardingSectionNavigation 
        activeSection={activeSection} 
        navigate={navigateToSection} 
        formData={formData}
      />

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
