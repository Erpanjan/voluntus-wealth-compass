
import React from 'react';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import { formatDate } from '@/lib/utils';

interface OnboardingReviewProps {
  formData: OnboardingFormData;
}

const OnboardingReview: React.FC<OnboardingReviewProps> = ({ formData }) => {
  const { profile, consultation } = formData;

  return (
    <div className="py-4">
      <div className="space-y-10">
        {/* Profile Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">First Name</p>
              <p className="text-gray-800">{profile.firstName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Name</p>
              <p className="text-gray-800">{profile.lastName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-gray-800">{profile.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-gray-800">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Preferred Communication</p>
              <p className="text-gray-800">{profile.preferredCommunication || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Media Account Number</p>
              <p className="text-gray-800">{profile.mediaAccountNumber || 'Not provided'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-gray-800">{profile.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Consultation Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Consultation Details</h3>
          {consultation.completed ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Consultation Type</p>
                <p className="text-gray-800">{consultation.type || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-gray-800">
                  {consultation.date ? formatDate(consultation.date) : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="text-gray-800">{consultation.time || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            <p className="text-amber-600 italic">No consultation scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingReview;
