
import React from 'react';
import { AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lineHeightOptions } from '../constants/editorConstants';

interface LineHeightPopoverProps {
  lineHeightPopoverOpen: boolean;
  setLineHeightPopoverOpen: (open: boolean) => void;
  handleLineHeightChange: (height: string) => void;
}

const LineHeightPopover: React.FC<LineHeightPopoverProps> = ({
  lineHeightPopoverOpen,
  setLineHeightPopoverOpen,
  handleLineHeightChange
}) => {
  return (
    <Popover open={lineHeightPopoverOpen} onOpenChange={setLineHeightPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
          title="Line Height"
        >
          <AlignJustify size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          <Label>Line Height</Label>
          <Select onValueChange={handleLineHeightChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select line height" />
            </SelectTrigger>
            <SelectContent>
              {lineHeightOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LineHeightPopover;
