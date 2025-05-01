
import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPopoverProps {
  colorPopoverOpen: boolean;
  setColorPopoverOpen: (open: boolean) => void;
  handleColorChange: (color: string) => void;
  colorOptions: Array<{ label: string; value: string }>;
}

const ColorPopover: React.FC<ColorPopoverProps> = ({
  colorPopoverOpen,
  setColorPopoverOpen,
  handleColorChange,
  colorOptions
}) => {
  return (
    <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
          title="Text Color"
        >
          <Palette size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-2 p-2">
          <Label className="mb-2">Text Color</Label>
          <div className="grid grid-cols-6 gap-1">
            {colorOptions.map((color) => (
              <Button 
                key={color.value} 
                variant="outline" 
                className="w-8 h-8 p-0 rounded-md border"
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color.value)}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPopover;
