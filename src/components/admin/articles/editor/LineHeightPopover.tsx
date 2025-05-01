
import React from 'react';
import { TextSelect } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

interface LineHeightPopoverProps {
  lineHeightPopoverOpen: boolean;
  setLineHeightPopoverOpen: (open: boolean) => void;
  handleLineHeightChange: (height: string) => void;
  lineHeights: Array<{ label: string; value: string }>;
}

const LineHeightPopover: React.FC<LineHeightPopoverProps> = ({
  lineHeightPopoverOpen,
  setLineHeightPopoverOpen,
  handleLineHeightChange,
  lineHeights
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
          <TextSelect size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="space-y-2 p-2">
          <Label>Line Spacing</Label>
          <ToggleGroup type="single" variant="outline" className="flex flex-col">
            {lineHeights.map((height) => (
              <ToggleGroupItem 
                key={height.value} 
                value={height.value} 
                onClick={() => handleLineHeightChange(height.value)}
                className="justify-start"
              >
                {height.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LineHeightPopover;
