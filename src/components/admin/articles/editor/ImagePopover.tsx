
import React, { RefObject } from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ImagePopoverProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  imagePopoverOpen: boolean;
  setImagePopoverOpen: (open: boolean) => void;
  handleImageUrlInsertion: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const ImagePopover: React.FC<ImagePopoverProps> = ({
  imageUrl,
  setImageUrl,
  imagePopoverOpen,
  setImagePopoverOpen,
  handleImageUrlInsertion,
  handleImageUpload,
  fileInputRef
}) => {
  return (
    <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
          title="Insert Image"
        >
          <Image size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium">Insert Image</h4>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">From URL</p>
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleImageUrlInsertion}
              >
                Insert
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Upload Image</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImagePopover;
