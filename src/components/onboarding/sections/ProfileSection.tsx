
import React from 'react';
import Section from '@/components/ui/Section';
import AvatarUpload from './profile/AvatarUpload';
import ProfileForm from './profile/ProfileForm';
import ActionButtons from './profile/ActionButtons';

interface ProfileSectionProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredCommunication: string;
    mediaAccountNumber: string;
    address: string;
    imageUrl: string | null;
  };
  updateProfileData: (data: Partial<ProfileSectionProps['profileData']>) => void;
  navigateToNext: () => void;
  handleSaveDraft: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  profileData, 
  updateProfileData,
  navigateToNext,
  handleSaveDraft
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfileData({ [name]: value });
  };

  const handleImageChange = (imageUrl: string | null) => {
    updateProfileData({ imageUrl });
  };

  const handleContinue = () => {
    if (!profileData.firstName || !profileData.lastName || !profileData.email || !profileData.phone) {
      return; // Add proper validation feedback in a real application
    }
    navigateToNext();
  };

  return (
    <Section
      title="Personal Information"
      subtitle="Let us know more about you; this will help us tailor the experience for you."
    >
      <div className="w-full max-w-2xl mx-auto">
        <AvatarUpload
          firstName={profileData.firstName}
          lastName={profileData.lastName}
          imageUrl={profileData.imageUrl}
          onImageChange={handleImageChange}
        />
        
        <ProfileForm 
          profileData={profileData}
          handleChange={handleChange}
        />
        
        <ActionButtons
          handleSaveDraft={handleSaveDraft}
          handleContinue={handleContinue}
        />
      </div>
    </Section>
  );
};

export default ProfileSection;
