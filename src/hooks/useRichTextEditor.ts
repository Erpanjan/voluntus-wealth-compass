import { useState, useRef, useCallback, RefObject } from 'react';
import { toast } from '@/hooks/use-toast';
import { insertImageIntoEditor } from '@/utils/imageUtils';

interface UseRichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const useRichTextEditor = ({ initialValue, onChange }: UseRichTextEditorProps) => {
  const [editorState, setEditorState] = useState(initialValue || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [lineHeightPopoverOpen, setLineHeightPopoverOpen] = useState(false);
  
  // Apply formatting to selected text
  const applyFormat = useCallback((command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    
    if (editorRef.current) {
      // Update the form value
      onChange(editorRef.current.innerHTML);
    }
    // Ensure editor keeps focus
    editorRef.current?.focus();
  }, [onChange]);

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorState(newContent);
      onChange(newContent);
    }
  }, [onChange]);

  // Insert Link
  const handleLinkInsertion = useCallback(() => {
    if (!linkUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    // Add http:// if protocol is missing
    let url = linkUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }

    applyFormat('createLink', url);
    setLinkUrl('');
    setLinkPopoverOpen(false);
  }, [linkUrl, applyFormat]);

  // Insert an image from URL
  const handleImageUrlInsertion = useCallback(() => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    insertImageIntoEditor(editorRef, imageUrl, onChange);
    setImageUrl('');
    setImagePopoverOpen(false);
  }, [imageUrl, onChange]);

  // Insert an image from file upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File must be an image",
        variant: "destructive"
      });
      return;
    }

    // Create a preview URL and insert it
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        insertImageIntoEditor(editorRef, reader.result, onChange);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // Apply font family
  const handleFontFamilyChange = useCallback((value: string) => {
    applyFormat('fontName', value);
  }, [applyFormat]);

  // Apply font size
  const handleFontSizeChange = useCallback((value: string) => {
    applyFormat('fontSize', value === '16px' ? '3' : value === '12px' ? '1' : 
                         value === '18px' ? '4' : value === '24px' ? '5' : 
                         value === '32px' ? '6' : '7');
  }, [applyFormat]);

  // Apply text color
  const handleColorChange = useCallback((color: string) => {
    applyFormat('foreColor', color);
    setColorPopoverOpen(false);
  }, [applyFormat]);

  // Apply line height
  const handleLineHeightChange = useCallback((height: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedNode = range.commonAncestorContainer;
        
        // Find the closest block element
        let parentElement: Element | null = null;
        if (selectedNode.nodeType === Node.TEXT_NODE && selectedNode.parentElement) {
          parentElement = selectedNode.parentElement;
        } else if (selectedNode.nodeType === Node.ELEMENT_NODE) {
          parentElement = selectedNode as Element;
        }
        
        if (parentElement) {
          // Apply line height to the parent element or paragraph
          const blockElement = parentElement.closest('p, div, h1, h2, h3, h4, h5, h6');
          if (blockElement) {
            (blockElement as HTMLElement).style.lineHeight = height;
          } else {
            // If no block element found, apply to selection directly
            document.execCommand('insertHTML', false, 
              `<div style="line-height: ${height}">${range.toString()}</div>`);
          }
          onChange(editorRef.current.innerHTML);
        }
      }
    }
    setLineHeightPopoverOpen(false);
  }, [onChange]);

  return {
    editorState,
    editorRef,
    linkUrl,
    setLinkUrl,
    linkPopoverOpen,
    setLinkPopoverOpen,
    imageUrl,
    setImageUrl,
    imagePopoverOpen,
    setImagePopoverOpen,
    fileInputRef,
    colorPopoverOpen,
    setColorPopoverOpen,
    lineHeightPopoverOpen,
    setLineHeightPopoverOpen,
    applyFormat,
    handleContentChange,
    handleLinkInsertion,
    handleImageUrlInsertion,
    handleImageUpload,
    handleFontFamilyChange,
    handleFontSizeChange,
    handleColorChange,
    handleLineHeightChange,
  };
};
