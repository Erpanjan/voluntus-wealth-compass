
import { useState, useCallback, RefObject } from 'react';
import { toast } from '@/hooks/use-toast';
import { insertImageIntoEditor } from '@/utils/imageUtils';

interface UseEditorImagesProps {
  editorRef: RefObject<HTMLDivElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
}

export const useEditorImages = ({ editorRef, fileInputRef, onChange }: UseEditorImagesProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);

  // Insert an image from URL
  const handleImageUrlInsertion = useCallback(() => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    insertImageIntoEditor(editorRef, imageUrl, onChange);
    setImageUrl('');
    setImagePopoverOpen(false);
  }, [imageUrl, onChange, editorRef]);

  // Insert an image from file upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File must be an image",
        variant: "destructive"
      });
      return;
    }

    // Create a preview URL and insert it
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        insertImageIntoEditor(editorRef, reader.result, onChange);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange, editorRef, fileInputRef]);

  return {
    imageUrl,
    setImageUrl,
    imagePopoverOpen,
    setImagePopoverOpen,
    handleImageUrlInsertion,
    handleImageUpload
  };
};
