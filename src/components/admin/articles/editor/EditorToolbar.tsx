
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

// Import toolbar components
import TextFormattingTools from './tools/TextFormattingTools';
import ColorPopover from './tools/ColorPopover';
import LineHeightPopover from './tools/LineHeightPopover';
import HeadingDropdown from './tools/HeadingDropdown';
import ListControls from './tools/ListControls';
import AlignmentControls from './tools/AlignmentControls';
import LinkPopover from './tools/LinkPopover';
import ImagePopover from './tools/ImagePopover';
import HistoryControls from './tools/HistoryControls';
import FontControls from './tools/FontControls';
import { colorOptions } from './constants/editorConstants';

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
        
        <FontControls 
          handleFontFamilyChange={handleFontFamilyChange}
          handleFontSizeChange={handleFontSizeChange}
        />
        
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
