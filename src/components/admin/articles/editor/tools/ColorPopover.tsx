
import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorOption {
  label: string;
  value: string;
}

interface ColorPopoverProps {
  colorPopoverOpen: boolean;
  setColorPopoverOpen: (open: boolean) => void;
  handleColorChange: (color: string) => void;
  colorOptions: ColorOption[];
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
      <PopoverContent className="w-64 bg-white border shadow-lg z-50">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Text Color</h4>
          <div className="grid grid-cols-8 gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: option.value }}
                onClick={() => handleColorChange(option.value)}
                title={option.label}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleColorChange('#000000')}
            className="w-full"
          >
            Reset to Default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPopover;
