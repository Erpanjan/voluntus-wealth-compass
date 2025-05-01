
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
    
    // Insert the image at cursor position with responsive styling
    const imgHtml = `<img src="${imageUrl}" alt="Article image" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px;" />`;
    
    // Use modern execCommand while it's still supported
    if (document.queryCommandSupported('insertHTML')) {
      document.execCommand('insertHTML', false, imgHtml);
    } else {
      // Fallback for browsers that might not support insertHTML
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const imgElement = document.createElement('div');
        imgElement.innerHTML = imgHtml;
        range.deleteContents();
        range.insertNode(imgElement.firstChild as Node);
      }
    }
    
    // Update form value
    if (onChange && typeof onChange === 'function') {
      onChange(editorRef.current.innerHTML);
    }
    
    // Provide feedback to user
    toast({
      title: "Success",
      description: "Image inserted successfully",
    });
  }
};

// Helper to validate URLs
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
