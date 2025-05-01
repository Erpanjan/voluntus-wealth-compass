
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface FeaturedImageUploadProps {
  imageUrl: string | undefined;
  onImageChange: (url: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({
  imageUrl,
  onImageChange,
  onImageUpload,
  uploadProgress,
  fileInputRef
}) => {
  return (
    <div className="flex items-start gap-4 mt-2">
      {imageUrl && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border">
          <img 
            src={imageUrl} 
            alt="Featured" 
            className="object-cover w-full h-full" 
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={() => onImageChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Upload a featured image for the article (recommended size: 1200x630px)
        </p>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{width: `${uploadProgress}%`}}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedImageUpload;
