
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useImageUpload = () => {
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    
    // Clean up previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      
      // In a real app, this would upload to a storage service
      // For now, we'll just simulate a delay and return a mock URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock image URL
      const mockImageUrl = `https://picsum.photos/seed/${uuidv4()}/800/400`;
      
      return mockImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Clean up when component unmounts
  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return {
    imageFile,
    previewUrl,
    uploadingImage,
    handleImageChange,
    uploadImage,
    cleanup
  };
};
