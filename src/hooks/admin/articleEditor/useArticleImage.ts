
import { useState, useRef } from 'react';
import { handleImageUpload, clearImageUpload } from '@/utils/imageUtils';

export const useArticleImage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleImageUpload(file, setImageFile, setImagePreview);
  };
  
  const handleRemoveImage = () => {
    clearImageUpload(fileInputRef, setImageFile, setImagePreview);
  };
  
  const loadImageData = (imageUrl: string | null) => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  };
  
  return {
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    loadImageData
  };
};
