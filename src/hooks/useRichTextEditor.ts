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

  // Handle content change - modified to fix cursor position issues
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorState(newContent);
      onChange(newContent);
    }
  }, [onChange]);

  // Handle content blur - separated from handleContentChange
  const handleContentBlur = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Custom paste handler to preserve formatting when pasting from Word/external sources
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    // Prevent default paste behavior
    e.preventDefault();
    
    // Get clipboard data
    const clipboardData = e.clipboardData;
    
    // Try to get HTML content first to preserve formatting
    let content = clipboardData.getData('text/html');
    
    // If no HTML content is available, fall back to plain text
    if (!content) {
      content = clipboardData.getData('text/plain');
      
      // For plain text, we need to preserve line breaks
      if (content) {
        // Replace newlines with <br> tags
        content = content
          .replace(/\n/g, '<br>')
          // Preserve consecutive spaces
          .replace(/\s{2,}/g, (match) => {
            return '&nbsp;'.repeat(match.length);
          });
      }
    } else {
      // For HTML content from Word/other sources, we need to clean it up
      // Remove Word specific XML tags and meta information
      content = content
        // Remove XML declarations and comments
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        // Remove Word namespace declarations
        .replace(/<\/?[a-z]:[^>]*>/g, '')
        // Remove style definitions but keep style attributes
        .replace(/<style>[\s\S]*?<\/style>/g, '')
        // Keep relevant content only (within body tag if exists)
        .replace(/.*<body[^>]*>([\s\S]*)<\/body>.*/i, '$1');
    }
    
    // Insert the cleaned content at cursor position
    if (document.queryCommandSupported('insertHTML')) {
      document.execCommand('insertHTML', false, content);
    } else {
      // Fallback for browsers that don't support insertHTML
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const fragment = range.createContextualFragment(content);
        range.deleteContents();
        range.insertNode(fragment);
      }
    }
    
    // Update the editor state
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
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
    handleContentBlur,
    handlePaste,
    handleLinkInsertion,
    handleImageUrlInsertion,
    handleImageUpload,
    handleFontFamilyChange,
    handleFontSizeChange,
    handleColorChange,
    handleLineHeightChange,
  };
};
