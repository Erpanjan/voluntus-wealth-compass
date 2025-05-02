
import React from 'react';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import { format } from 'date-fns';
import { getReadableTimeFormat } from './consultation/utils';

interface OnboardingReviewProps {
  formData: OnboardingFormData;
}

const OnboardingReview: React.FC<OnboardingReviewProps> = ({ formData }) => {
  const formatConsultationType = (type: string) => {
    if (type === 'virtual') return 'Virtual Meeting';
    if (type === 'in-person') return 'In-Person Meeting';
    return type;
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="space-y-8 py-4">
      {/* Personal Information */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{formData.profile.firstName} {formData.profile.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium">{formData.profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{formData.profile.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preferred Communication</p>
            <p className="font-medium">{formData.profile.preferredCommunication || 'Not specified'}</p>
          </div>
          {formData.profile.mediaAccountNumber && (
            <div>
              <p className="text-sm text-gray-500">Media Account Number</p>
              <p className="font-medium">{formData.profile.mediaAccountNumber}</p>
            </div>
          )}
          {formData.profile.address && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{formData.profile.address}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Questionnaire Information (if completed) */}
      {formData.questionnaire.completed && Object.keys(formData.questionnaire.answers).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Questionnaire Responses</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              You have completed the financial questionnaire. Your answers will be reviewed by your financial advisor during the consultation.
            </p>
          </div>
        </div>
      )}
      
      {/* Consultation Details */}
      {formData.consultation.type && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Consultation Details</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{formatConsultationType(formData.consultation.type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(formData.consultation.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {getReadableTimeFormat(formData.consultation.startTime)} - {getReadableTimeFormat(formData.consultation.endTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingReview;
