
import React from 'react';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
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
        <div className="space-y-3">
          <h4 className="font-medium">Insert Link</h4>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLinkInsertion();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLinkPopoverOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleLinkInsertion}
                disabled={!linkUrl}
              >
                Insert
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkPopover;
