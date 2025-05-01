
import React from 'react';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LinkPopoverProps {
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  linkPopoverOpen: boolean;
  setLinkPopoverOpen: (open: boolean) => void;
  handleLinkInsertion: () => void;
}

const LinkPopover: React.FC<LinkPopoverProps> = ({
  linkUrl,
  setLinkUrl,
  linkPopoverOpen,
  setLinkPopoverOpen,
  handleLinkInsertion
}) => {
  return (
    <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
          title="Insert Link"
        >
          <Link size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Insert Link</h4>
          <Input
            type="text"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={handleLinkInsertion}
            >
              Insert
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkPopover;
