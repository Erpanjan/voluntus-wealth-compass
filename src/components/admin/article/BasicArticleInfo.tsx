
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FeaturedImageUpload from './FeaturedImageUpload';

interface BasicArticleInfoProps {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (url: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const BasicArticleInfo: React.FC<BasicArticleInfoProps> = ({
  title,
  category,
  description,
  imageUrl,
  onInputChange,
  onImageChange,
  onImageUpload,
  uploadProgress,
  fileInputRef
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Article Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter article title"
            value={title}
            onChange={onInputChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            placeholder="E.g., RESEARCH & INSIGHTS, NEWS, PEOPLE"
            value={category}
            onChange={onInputChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description/Summary</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter a brief description of the article"
            value={description}
            onChange={onInputChange}
            rows={3}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="image_url">Featured Image</Label>
          <FeaturedImageUpload 
            imageUrl={imageUrl}
            onImageChange={onImageChange}
            onImageUpload={onImageUpload}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicArticleInfo;
