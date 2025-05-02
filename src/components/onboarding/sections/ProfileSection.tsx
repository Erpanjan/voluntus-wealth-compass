import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import Section from '@/components/ui/Section';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profileData.imageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfileData({ [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      updateProfileData({ imageUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-28 w-28 mb-3 cursor-pointer" onClick={triggerFileInput}>
            <AvatarImage src={imagePreview || ""} />
            <AvatarFallback className="text-2xl bg-gray-200 flex flex-col items-center justify-center">
              {profileData.firstName && profileData.lastName ? 
                profileData.firstName[0] + profileData.lastName[0] : 
                <Upload className="h-8 w-8 text-gray-500" />}
            </AvatarFallback>
          </Avatar>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <Button variant="outline" size="sm" onClick={triggerFileInput}>
            Upload Photo
          </Button>
        </div>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Input
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                placeholder="First name*"
                required
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-1.5">
              <Input
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="Last name*"
                required
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Email address*"
              required
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              placeholder="Phone number*"
              required
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="preferredCommunication"
              name="preferredCommunication"
              value={profileData.preferredCommunication}
              onChange={handleChange}
              placeholder="Preferred communication venue (Email, Phone, WeChat, WhatsApp, etc.)"
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="mediaAccountNumber"
              name="mediaAccountNumber"
              value={profileData.mediaAccountNumber}
              onChange={handleChange}
              placeholder="Media account number"
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-3">
            * Required fields
          </p>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
};

export default ProfileSection;
