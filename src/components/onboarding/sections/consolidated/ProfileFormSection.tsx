
import React, { useState, useRef } from 'react';
import ProfileHeader from './profile/ProfileHeader';
import ProfileAvatar from './profile/ProfileAvatar';
import ProfileFormFields from './profile/ProfileFormFields';

interface ProfileFormSectionProps {
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
  updateProfileData: (data: Partial<ProfileFormSectionProps['profileData']>) => void;
}

const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({ 
  profileData, 
  updateProfileData
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfileData({ [name]: value });
  };

  const handleImageChange = (imageUrl: string | null) => {
    updateProfileData({ imageUrl });
  };

  return (
    <div>
      <ProfileHeader />
      
      <ProfileAvatar 
        firstName={profileData.firstName} 
        lastName={profileData.lastName}
        imageUrl={profileData.imageUrl}
        onImageChange={handleImageChange}
      />
      
      <form className="space-y-6">
        <ProfileFormFields 
          profileData={profileData}
          handleChange={handleChange}
        />
      </form>
    </div>
  );
};

export default ProfileFormSection;
