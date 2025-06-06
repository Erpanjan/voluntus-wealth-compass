
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

const ProfileCreation = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredCommunication: '',
    mediaAccountNumber: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <p className="text-lg mb-6">
        Let us know more about you; this will help us tailor the experience for you.
      </p>

      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-28 w-28 mb-3 cursor-pointer" onClick={triggerFileInput}>
            <AvatarImage src={imagePreview || ""} />
            <AvatarFallback className="text-2xl bg-gray-200 flex flex-col items-center justify-center">
              {profile.firstName && profile.lastName ? 
                profile.firstName[0] + profile.lastName[0] : 
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
                value={profile.firstName}
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
                value={profile.lastName}
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
              value={profile.email}
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
              value={profile.phone}
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
              value={profile.preferredCommunication}
              onChange={handleChange}
              placeholder="Preferred communication venue (Email, Phone, WeChat, WhatsApp, etc.)"
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="mediaAccountNumber"
              name="mediaAccountNumber"
              value={profile.mediaAccountNumber}
              onChange={handleChange}
              placeholder="Media account number"
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Address"
              className="border-0 border-b border-gray-300 rounded-none px-0 h-10 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-3">
            * Required fields
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
