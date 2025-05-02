
import React from 'react';
import Section from '@/components/ui/Section';
import ProfileReviewCard from './review/ProfileReviewCard';
import QuestionnaireReviewCard from './review/QuestionnaireReviewCard';
import ConsultationReviewCard from './review/ConsultationReviewCard';
import ReviewActionButtons from './review/ReviewActionButtons';

interface ReviewSectionProps {
  formData: {
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
  };
  navigateTo: (section: string) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  formData,
  navigateTo,
  handleSubmit,
  handleSaveDraft
}) => {
  // Check if we can submit the application
  const canSubmit = formData.consultation.completed;

  return (
    <Section
      title="Review Your Information"
      subtitle="Please review all the information you've provided before submitting your application."
    >
      <div className="w-full max-w-2xl mx-auto">
        <ProfileReviewCard 
          profile={formData.profile}
          navigateTo={navigateTo}
        />
        
        <QuestionnaireReviewCard 
          questionnaire={formData.questionnaire}
          navigateTo={navigateTo}
        />
        
        <ConsultationReviewCard 
          consultation={formData.consultation}
          navigateTo={navigateTo}
        />
        
        <ReviewActionButtons
          navigateTo={navigateTo}
          handleSaveDraft={handleSaveDraft}
          handleSubmit={handleSubmit}
          canSubmit={canSubmit}
        />
      </div>
    </Section>
  );
};

export default ReviewSection;
