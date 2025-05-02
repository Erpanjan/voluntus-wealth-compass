
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileReviewCardProps {
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
  navigateTo: (section: string) => void;
}

const ProfileReviewCard: React.FC<ProfileReviewCardProps> = ({ profile, navigateTo }) => {
  return (
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
            <AvatarImage src={profile.imageUrl || ""} />
            <AvatarFallback className="text-lg">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2">
            <span className="text-gray-500">Phone:</span>
            <span>{profile.phone}</span>
          </div>
          {profile.preferredCommunication && (
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Preferred Communication:</span>
              <span>{profile.preferredCommunication}</span>
            </div>
          )}
          {profile.mediaAccountNumber && (
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Media Account Number:</span>
              <span>{profile.mediaAccountNumber}</span>
            </div>
          )}
          {profile.address && (
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Address:</span>
              <span>{profile.address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileReviewCard;
