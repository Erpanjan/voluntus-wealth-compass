
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ArticleImageUploadProps {
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
}

const ArticleImageUpload = ({ previewUrl, handleImageChange }: ArticleImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Feature Image</Label>
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
        <div>
          <div className="border border-input rounded-md p-2 bg-background">
            <div className="relative">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleImageChange(file);
                }}
                className="p-1"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload an image for your article (max 10MB)
          </p>
        </div>
        {previewUrl && (
          <div className="w-20 h-20 overflow-hidden rounded-md border">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleImageUpload;
