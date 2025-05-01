
import React from 'react';
import { Type, Text } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fontFamilies, fontSizes } from '../constants/editorConstants';

interface FontControlsProps {
  handleFontFamilyChange: (value: string) => void;
  handleFontSizeChange: (value: string) => void;
}

const FontControls: React.FC<FontControlsProps> = ({ 
  handleFontFamilyChange,
  handleFontSizeChange
}) => {
  return (
    <>
      {/* Font Family Control */}
      <div className="flex items-center mr-1">
        <Type size={16} className="mr-1" />
        <Select onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Font Family" />
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
      
      {/* Font Size Control */}
      <div className="flex items-center mr-1">
        <Text size={16} className="mr-1" />
        <Select onValueChange={handleFontSizeChange}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue placeholder="Font Size" />
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
    </>
  );
};

export default FontControls;
