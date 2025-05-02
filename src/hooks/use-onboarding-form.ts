
import { useState, useEffect } from 'react';

// Types for our form state
export interface OnboardingFormData {
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
    startTime: string;
    endTime: string;
  };
}

export function useOnboardingForm() {
  // Initialize form data with localStorage persistence
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
      startTime: '',
      endTime: '',
    },
  };

  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    const savedData = localStorage.getItem('onboardingDraft');
    return savedData ? JSON.parse(savedData) : initialFormData;
  });

  // Update localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('onboardingDraft', JSON.stringify(formData));
  }, [formData]);

  // Check if consultation is complete
  useEffect(() => {
    if (formData.consultation.type && 
        formData.consultation.date && 
        formData.consultation.startTime && 
        formData.consultation.endTime) {
      updateConsultationData({ completed: true });
    }
  }, [formData.consultation.type, formData.consultation.date, formData.consultation.startTime, formData.consultation.endTime]);

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

  return {
    formData,
    updateProfileData,
    updateQuestionnaireData,
    updateConsultationData
  };
}
