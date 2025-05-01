
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload } from 'lucide-react';
import { FormDescription, FormLabel } from '@/components/ui/form';

interface ArticleImageUploadProps {
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const ArticleImageUpload: React.FC<ArticleImageUploadProps> = ({
  imagePreview,
  fileInputRef,
  handleImageChange,
  handleRemoveImage
}) => {
  return (
    <div>
      <FormLabel>Feature Image</FormLabel>
      <FormDescription className="mb-3">
        Upload an image for your article (max 10MB)
      </FormDescription>
      
      {imagePreview ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200 mb-2">
          <img 
            src={imagePreview} 
            alt="Article feature" 
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium">Click to upload</p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max 10MB)</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ArticleImageUpload;
