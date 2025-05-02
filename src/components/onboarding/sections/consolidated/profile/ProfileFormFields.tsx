
import React from 'react';
import { Input } from '@/components/ui/input';

interface ProfileFormFieldsProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredCommunication: string;
    mediaAccountNumber: string;
    address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({ 
  profileData, 
  handleChange 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
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

        <div>
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

      <div>
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

      <div>
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

      <div>
        <Input
          id="preferredCommunication"
          name="preferredCommunication"
          value={profileData.preferredCommunication}
          onChange={handleChange}
          placeholder="Preferred communication venue (Email, Phone, WeChat, WhatsApp, etc.)"
          className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
        />
      </div>

      <div>
        <Input
          id="mediaAccountNumber"
          name="mediaAccountNumber"
          value={profileData.mediaAccountNumber}
          onChange={handleChange}
          placeholder="Media account number"
          className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
        />
      </div>

      <div>
        <Input
          id="address"
          name="address"
          value={profileData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
        />
      </div>
      
      <p className="text-xs text-center text-gray-500">
        * Required fields
      </p>
    </>
  );
};

export default ProfileFormFields;
