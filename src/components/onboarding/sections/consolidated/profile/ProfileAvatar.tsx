
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  onImageChange: (imageUrl: string | null) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  firstName, 
  lastName, 
  imageUrl, 
  onImageChange 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const result = reader.result as string;
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <Avatar className="h-28 w-28 mb-3 cursor-pointer" onClick={triggerFileInput}>
        <AvatarImage src={imageUrl || ""} />
        <AvatarFallback className="text-2xl bg-gray-200 flex flex-col items-center justify-center">
          {firstName && lastName ? 
            firstName[0] + lastName[0] : 
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
  );
};

export default ProfileAvatar;
