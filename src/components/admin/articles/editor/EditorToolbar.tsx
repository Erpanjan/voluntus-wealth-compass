
import React, { RefObject } from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Type, Text } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TextFormattingTools from './TextFormattingTools';
import ColorPopover from './ColorPopover';
import LineHeightPopover from './LineHeightPopover';
import HeadingDropdown from './HeadingDropdown';
import ListControls from './ListControls';
import AlignmentControls from './AlignmentControls';
import LinkPopover from './LinkPopover';
import ImagePopover from './ImagePopover';
import HistoryControls from './HistoryControls';

interface EditorToolbarProps {
  applyFormat: (command: string, value?: string) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  linkPopoverOpen: boolean;
  setLinkPopoverOpen: (open: boolean) => void;
  handleLinkInsertion: () => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  imagePopoverOpen: boolean;
  setImagePopoverOpen: (open: boolean) => void;
  handleImageUrlInsertion: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  fontOptionsOpen: boolean;
  setFontOptionsOpen: (open: boolean) => void;
  colorPopoverOpen: boolean;
  setColorPopoverOpen: (open: boolean) => void;
  lineHeightPopoverOpen: boolean;
  setLineHeightPopoverOpen: (open: boolean) => void;
  handleFontFamilyChange: (value: string) => void;
  handleFontSizeChange: (value: string) => void;
  handleColorChange: (color: string) => void;
  handleLineHeightChange: (height: string) => void;
}

// These constants were moved from the main component
const fontFamilies = [
  { label: "Default", value: "inherit" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" },
  { label: "Space", value: "'Space Grotesk', sans-serif" },
  { label: "Manrope", value: "'Manrope', sans-serif" }
];

const fontSizes = [
  { label: "Small", value: "12px" },
  { label: "Normal", value: "16px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "24px" },
  { label: "X-Large", value: "32px" },
  { label: "XX-Large", value: "48px" },
];

const lineHeights = [
  { label: "Tight", value: "1.2" },
  { label: "Normal", value: "1.5" },
  { label: "Relaxed", value: "1.8" },
  { label: "Loose", value: "2" },
];

const colorOptions = [
  { label: "Black", value: "#000000" },
  { label: "Dark Gray", value: "#333333" },
  { label: "Gray", value: "#666666" },
  { label: "Medium Gray", value: "#999999" },
  { label: "Light Gray", value: "#CCCCCC" },
  { label: "Primary", value: "#8B5CF6" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Yellow", value: "#F59E0B" },
  { label: "Green", value: "#10B981" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
];

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  applyFormat,
  linkUrl,
  setLinkUrl,
  linkPopoverOpen,
  setLinkPopoverOpen,
  handleLinkInsertion,
  imageUrl,
  setImageUrl,
  imagePopoverOpen,
  setImagePopoverOpen,
  handleImageUrlInsertion,
  handleImageUpload,
  fileInputRef,
  colorPopoverOpen,
  setColorPopoverOpen,
  lineHeightPopoverOpen,
  setLineHeightPopoverOpen,
  handleFontFamilyChange,
  handleFontSizeChange,
  handleColorChange,
  handleLineHeightChange
}) => {
  return (
    <ScrollArea className="toolbar bg-[#F6F6F7] p-3 border-b flex flex-wrap items-center gap-1.5">
      <div className="flex items-center gap-1 flex-wrap">
        <TextFormattingTools applyFormat={applyFormat} />
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        {/* Font Family Control - Separated from Font Size */}
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
        
        {/* Font Size Control - Separated from Font Family */}
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
        
        <ColorPopover
          colorPopoverOpen={colorPopoverOpen}
          setColorPopoverOpen={setColorPopoverOpen}
          handleColorChange={handleColorChange}
          colorOptions={colorOptions}
        />
        
        <LineHeightPopover
          lineHeightPopoverOpen={lineHeightPopoverOpen}
          setLineHeightPopoverOpen={setLineHeightPopoverOpen}
          handleLineHeightChange={handleLineHeightChange}
          lineHeights={lineHeights}
        />
        
        <HeadingDropdown applyFormat={applyFormat} />

        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <ListControls applyFormat={applyFormat} />
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <AlignmentControls applyFormat={applyFormat} />
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <LinkPopover
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          linkPopoverOpen={linkPopoverOpen}
          setLinkPopoverOpen={setLinkPopoverOpen}
          handleLinkInsertion={handleLinkInsertion}
        />

        <ImagePopover
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          imagePopoverOpen={imagePopoverOpen}
          setImagePopoverOpen={setImagePopoverOpen}
          handleImageUrlInsertion={handleImageUrlInsertion}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <HistoryControls applyFormat={applyFormat} />
      </div>
    </ScrollArea>
  );
};

export default EditorToolbar;
