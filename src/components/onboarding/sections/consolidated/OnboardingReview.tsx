import React from 'react';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OnboardingReviewProps {
  formData: OnboardingFormData;
}

const OnboardingReview: React.FC<OnboardingReviewProps> = ({ formData }) => {
  // Helper function to get display values for consultation
  const getConsultationTypeLabel = (type: string) => {
    return type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting';
  };

  const getDateLabel = (dateValue: string) => {
    const dates = [
      { value: '2025-05-05', label: 'Monday, May 5' },
      { value: '2025-05-06', label: 'Tuesday, May 6' },
      { value: '2025-05-07', label: 'Wednesday, May 7' },
      { value: '2025-05-08', label: 'Thursday, May 8' },
      { value: '2025-05-09', label: 'Friday, May 9' }
    ];
    return dates.find(d => d.value === dateValue)?.label || dateValue;
  };

  const getTimeLabel = (timeValue: string) => {
    const times = [
      { value: '09:00', label: '9:00 AM' },
      { value: '10:00', label: '10:00 AM' },
      { value: '11:00', label: '11:00 AM' },
      { value: '14:00', label: '2:00 PM' },
      { value: '15:00', label: '3:00 PM' },
      { value: '16:00', label: '4:00 PM' },
    ];
    return times.find(t => t.value === timeValue)?.label || timeValue;
  };

  // Helper function to display questionnaire answers
  const getQuestionnaireAnswerLabel = (questionId: string, value: string) => {
    const labels: Record<string, Record<string, string>> = {
      investmentGoals: {
        retirement: 'Retirement Planning',
        wealth: 'Wealth Accumulation',
        income: 'Regular Income',
        education: 'Education Funding',
        other: 'Other Goals'
      },
      riskTolerance: {
        conservative: 'Conservative - Preserve capital with minimal risk',
        moderate: 'Moderate - Balance between growth and capital preservation',
        aggressive: 'Aggressive - Maximize growth, comfortable with volatility'
      },
      timeHorizon: {
        short: 'Short term (1-3 years)',
        medium: 'Medium term (3-10 years)',
        long: 'Long term (10+ years)'
      }
    };

    return labels[questionId]?.[value] || value;
  };

  return (
    <div className="py-4 space-y-8">
      {/* Profile Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={formData.profile.imageUrl || ""} />
            <AvatarFallback className="text-lg bg-gray-200">
              {formData.profile.firstName && formData.profile.lastName ? 
                formData.profile.firstName[0] + formData.profile.lastName[0] : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-medium text-lg">
              {formData.profile.firstName} {formData.profile.lastName}
            </h4>
            <p className="text-gray-600">{formData.profile.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p>{formData.profile.phone || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Preferred Communication</p>
            <p>{formData.profile.preferredCommunication || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Media Account Number</p>
            <p>{formData.profile.mediaAccountNumber || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p>{formData.profile.address || 'Not provided'}</p>
          </div>
        </div>
      </div>
      
      {/* Questionnaire Section */}
      {Object.keys(formData.questionnaire.answers).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Financial Questionnaire</h3>
          
          <div className="space-y-4">
            {formData.questionnaire.answers.investmentGoals && (
              <div>
                <p className="text-sm text-gray-500">Primary Investment Goals</p>
                <p>{getQuestionnaireAnswerLabel('investmentGoals', formData.questionnaire.answers.investmentGoals)}</p>
              </div>
            )}
            
            {formData.questionnaire.answers.riskTolerance && (
              <div>
                <p className="text-sm text-gray-500">Risk Tolerance</p>
                <p>{getQuestionnaireAnswerLabel('riskTolerance', formData.questionnaire.answers.riskTolerance)}</p>
              </div>
            )}
            
            {formData.questionnaire.answers.timeHorizon && (
              <div>
                <p className="text-sm text-gray-500">Investment Time Horizon</p>
                <p>{getQuestionnaireAnswerLabel('timeHorizon', formData.questionnaire.answers.timeHorizon)}</p>
              </div>
            )}
            
            {formData.questionnaire.answers.additionalInfo && (
              <div>
                <p className="text-sm text-gray-500">Additional Information</p>
                <p className="whitespace-pre-wrap">{formData.questionnaire.answers.additionalInfo}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Consultation Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Consultation Details</h3>
        
        {formData.consultation.completed ? (
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="font-medium mb-1">Consultation Scheduled</p>
            <p className="text-gray-700">
              Your {getConsultationTypeLabel(formData.consultation.type)} consultation has been scheduled for {getDateLabel(formData.consultation.date)} at {getTimeLabel(formData.consultation.time)}.
            </p>
          </div>
        ) : (
          <p className="text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4">
            No consultation has been scheduled. A consultation is required to submit your application.
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingReview;
