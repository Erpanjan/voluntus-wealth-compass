
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ArticleImageUploadProps {
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
}

const ArticleImageUpload = ({ previewUrl, handleImageChange }: ArticleImageUploadProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleDeleteImage = () => {
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clear the image by passing null to parent handler
    handleImageChange(null);
  };

  return (
    <div className="space-y-4">
      <Label>Feature Image</Label>
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
        <div>
          <div className="border border-input rounded-md p-2 bg-background">
            <div className="relative">
              <Input 
                ref={fileInputRef}
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
          <div className="relative w-24 h-24 overflow-hidden rounded-md border group">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDeleteImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleImageUpload;
