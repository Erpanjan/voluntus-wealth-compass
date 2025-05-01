
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
      <FormLabel className="text-gray-700 text-base">Feature Image</FormLabel>
      <FormDescription className="text-gray-500 mb-3">
        Upload an image for your article (max 10MB)
      </FormDescription>
      
      {imagePreview ? (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={imagePreview} 
              alt="Article feature" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <FileImage className="mr-2 text-gray-600" size={18} />
              <span className="text-sm font-medium text-gray-800">Image uploaded successfully</span>
              <CheckCircle size={16} className="ml-2 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Click upload button to change, or remove to delete</p>
            
            <div className="flex gap-3 mt-4">
              <Button
                type="button" 
                size="sm"
                variant="outline"
                className="text-gray-600 hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="mr-2" />
                Change Image
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-base font-medium text-gray-700">Click to upload</p>
          <p className="text-sm text-gray-500 mt-2">SVG, PNG, JPG or GIF (max 10MB)</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <Upload size={16} className="mr-2" />
            Browse Files
          </Button>
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
