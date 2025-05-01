
import { toast } from '@/hooks/use-toast';

export const handleImageUpload = (
  file: File,
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
): boolean => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast({
      title: 'Error',
      description: 'Image file size must be less than 10MB',
      variant: 'destructive',
    });
    return false;
  }
  
  setImageFile(file);
  
  // Create a preview URL
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
  reader.readAsDataURL(file);
  
  return true;
};

export const clearImageUpload = (
  fileInputRef: React.RefObject<HTMLInputElement>,
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
): void => {
  setImageFile(null);
  setImagePreview(null);
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

// Helper for inserting image into rich text editor
export const insertImageIntoEditor = (
  editorRef: React.RefObject<HTMLDivElement>,
  imageUrl: string,
  onChange: (value: string) => void
): void => {
  if (editorRef.current) {
    // Focus the editor
    editorRef.current.focus();
    
    // Insert the image at cursor position
    document.execCommand('insertImage', false, imageUrl);
    
    // Update form value
    if (onChange && typeof onChange === 'function') {
      onChange(editorRef.current.innerHTML);
    }
  }
};
