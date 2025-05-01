
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, FileImage, CheckCircle } from 'lucide-react';
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
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={imagePreview} 
              alt="Article feature" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <FileImage className="mr-2 text-gray-500" size={16} />
              <span className="text-sm font-medium">Image uploaded</span>
              <CheckCircle size={16} className="ml-2 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Click upload button to change</p>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveImage}
            className="flex-shrink-0"
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
