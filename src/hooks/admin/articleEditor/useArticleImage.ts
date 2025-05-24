
import { useState, useRef } from 'react';

export const useArticleImage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadImageData = (imageUrl?: string) => {
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
    loadImageData,
  };
};
