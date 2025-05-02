
import React from 'react';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  // Helper to get date label
  const getDateLabel = (dateValue: string) => {
    const dates = [
      { value: '2025-05-05', label: 'Monday, May 5' },
      { value: '2025-05-06', label: 'Tuesday, May 6' },
      { value: '2025-05-07', label: 'Wednesday, May 7' },
      { value: '2025-05-08', label: 'Thursday, May 8' },
      { value: '2025-05-09', label: 'Friday, May 9' }
    ];
    const date = dates.find(d => d.value === dateValue);
    return date?.label || dateValue;
  };

  // Helper to get time label
  const getTimeLabel = (timeValue: string) => {
    const times = [
      { value: '09:00', label: '9:00 AM' },
      { value: '10:00', label: '10:00 AM' },
      { value: '11:00', label: '11:00 AM' },
      { value: '14:00', label: '2:00 PM' },
      { value: '15:00', label: '3:00 PM' },
      { value: '16:00', label: '4:00 PM' },
    ];
    const time = times.find(t => t.value === timeValue);
    return time?.label || timeValue;
  };

  // Helper for questionnaire answers
  const getAnswerLabel = (questionId: string, value: string) => {
    if (questionId === 'investmentGoals') {
      const options = {
        'retirement': 'Retirement Planning',
        'wealth': 'Wealth Accumulation',
        'income': 'Regular Income',
        'education': 'Education Funding',
        'other': 'Other Goals'
      };
      return options[value as keyof typeof options] || value;
    } else if (questionId === 'riskTolerance') {
      const options = {
        'conservative': 'Conservative - Preserve capital with minimal risk',
        'moderate': 'Moderate - Balance between growth and capital preservation',
        'aggressive': 'Aggressive - Maximize growth, comfortable with volatility'
      };
      return options[value as keyof typeof options] || value;
    } else if (questionId === 'timeHorizon') {
      const options = {
        'short': 'Short term (1-3 years)',
        'medium': 'Medium term (3-10 years)',
        'long': 'Long term (10+ years)'
      };
      return options[value as keyof typeof options] || value;
    }
    return value;
  };

  // Check if we can submit the application
  const canSubmit = formData.consultation.completed;

  return (
    <Section
      title="Review Your Information"
      subtitle="Please review all the information you've provided before submitting your application."
    >
      <div className="w-full max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Personal Information</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('profile')}
              >
                Edit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.profile.imageUrl || ""} />
                <AvatarFallback className="text-lg">
                  {formData.profile.firstName?.[0]}{formData.profile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">
                  {formData.profile.firstName} {formData.profile.lastName}
                </h3>
                <p className="text-gray-500">{formData.profile.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Phone:</span>
                <span>{formData.profile.phone}</span>
              </div>
              {formData.profile.preferredCommunication && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Preferred Communication:</span>
                  <span>{formData.profile.preferredCommunication}</span>
                </div>
              )}
              {formData.profile.mediaAccountNumber && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Media Account Number:</span>
                  <span>{formData.profile.mediaAccountNumber}</span>
                </div>
              )}
              {formData.profile.address && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Address:</span>
                  <span>{formData.profile.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Financial Questionnaire</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('questionnaire')}
              >
                Edit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.questionnaire.completed ? (
              <div className="space-y-4">
                {formData.questionnaire.answers.investmentGoals && (
                  <div>
                    <h4 className="font-medium mb-1">Investment Goals</h4>
                    <p>{getAnswerLabel('investmentGoals', formData.questionnaire.answers.investmentGoals)}</p>
                  </div>
                )}
                
                {formData.questionnaire.answers.riskTolerance && (
                  <div>
                    <h4 className="font-medium mb-1">Risk Tolerance</h4>
                    <p>{getAnswerLabel('riskTolerance', formData.questionnaire.answers.riskTolerance)}</p>
                  </div>
                )}
                
                {formData.questionnaire.answers.timeHorizon && (
                  <div>
                    <h4 className="font-medium mb-1">Investment Time Horizon</h4>
                    <p>{getAnswerLabel('timeHorizon', formData.questionnaire.answers.timeHorizon)}</p>
                  </div>
                )}
                
                {formData.questionnaire.answers.additionalInfo && (
                  <div>
                    <h4 className="font-medium mb-1">Additional Information</h4>
                    <p className="whitespace-pre-wrap">{formData.questionnaire.answers.additionalInfo}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No questionnaire responses provided.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Consultation Details</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('consultation')}
              >
                Edit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.consultation.completed ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Consultation Type:</span>
                  <span>{formData.consultation.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Date:</span>
                  <span>{getDateLabel(formData.consultation.date)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Time:</span>
                  <span>{getTimeLabel(formData.consultation.time)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Duration:</span>
                  <span>45 minutes</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-md">
                <p className="font-medium">Consultation not scheduled</p>
                <p className="text-sm mt-1">
                  A consultation is required to submit your application.
                  Please schedule a consultation to proceed.
                </p>
                <Button 
                  className="mt-3"
                  variant="outline"
                  onClick={() => navigateTo('consultation')}
                >
                  Schedule Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigateTo('consultation')}
          >
            Back
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ReviewSection;
