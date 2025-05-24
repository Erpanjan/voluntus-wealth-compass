
import React from 'react';
import { FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface VideoPopoverProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  videoPopoverOpen: boolean;
  setVideoPopoverOpen: (open: boolean) => void;
  handleVideoInsertion: () => void;
}

const VideoPopover: React.FC<VideoPopoverProps> = ({
  videoUrl,
  setVideoUrl,
  videoPopoverOpen,
  setVideoPopoverOpen,
  handleVideoInsertion
}) => {
  return (
    <Popover open={videoPopoverOpen} onOpenChange={setVideoPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
          title="Insert Video"
        >
          <FileVideo size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium">Insert Video</h4>
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleVideoInsertion}
                disabled={!videoUrl}
              >
                Insert Video
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Supported platforms:</p>
            <ul className="list-disc list-inside mt-1">
              <li>YouTube</li>
              <li>Vimeo</li>
              <li>Dailymotion</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VideoPopover;
