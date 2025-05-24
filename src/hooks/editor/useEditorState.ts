
import { useState, useRef } from 'react';

export const useEditorState = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [lineHeightPopoverOpen, setLineHeightPopoverOpen] = useState(false);
  
  return {
    editorRef,
    fileInputRef,
    colorPopoverOpen,
    setColorPopoverOpen,
    lineHeightPopoverOpen,
    setLineHeightPopoverOpen
  };
};
