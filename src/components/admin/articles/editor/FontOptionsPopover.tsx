
import React from 'react';
import { Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FontOptionsPopoverProps {
  fontOptionsOpen: boolean;
  setFontOptionsOpen: (open: boolean) => void;
  handleFontFamilyChange: (value: string) => void;
  handleFontSizeChange: (value: string) => void;
  fontFamilies: Array<{ label: string; value: string }>;
  fontSizes: Array<{ label: string; value: string }>;
}

const FontOptionsPopover: React.FC<FontOptionsPopoverProps> = ({
  fontOptionsOpen,
  setFontOptionsOpen,
  handleFontFamilyChange,
  handleFontSizeChange,
  fontFamilies,
  fontSizes
}) => {
  return (
    <Popover open={fontOptionsOpen} onOpenChange={setFontOptionsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 flex items-center gap-1 px-2 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
          title="Font Options"
        >
          <Type size={16} />
          <span>Font</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4 p-2">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select onValueChange={handleFontFamilyChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select onValueChange={handleFontSizeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <span style={{ fontSize: size.label === "Normal" ? "14px" : "14px" }}>{size.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontOptionsPopover;
