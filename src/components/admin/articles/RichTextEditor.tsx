
import React, { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { insertImageIntoEditor } from '@/utils/imageUtils';
import EditorToolbar from './editor/EditorToolbar';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(value || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontOptionsOpen, setFontOptionsOpen] = useState(false);
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

  // Image resizing handler
  const handleImageResize = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG' && editorRef.current) {
      const img = target as HTMLImageElement;
      
      // Make image resizable
      img.style.cursor = 'pointer';
      img.style.maxWidth = '100%';
      
      // Add resizable class and data if not already there
      if (!img.classList.contains('resizable-image')) {
        img.classList.add('resizable-image');
        img.setAttribute('data-initial-width', img.width.toString());
        img.setAttribute('data-initial-height', img.height.toString());
        
        // Add resize handles
        const resizeHandles = document.createElement('div');
        resizeHandles.className = 'resize-handles';
        resizeHandles.style.position = 'absolute';
        resizeHandles.style.border = '1px dashed #666';
        resizeHandles.style.pointerEvents = 'none';
        
        // Position it on top of the image
        const imgRect = img.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        resizeHandles.style.left = `${imgRect.left - editorRect.left}px`;
        resizeHandles.style.top = `${imgRect.top - editorRect.top}px`;
        resizeHandles.style.width = `${imgRect.width}px`;
        resizeHandles.style.height = `${imgRect.height}px`;
        
        editorRef.current.appendChild(resizeHandles);
      }
      
      // Add context menu for images
      img.oncontextmenu = (e) => {
        e.preventDefault();
        
        // Create simple context menu for resizing
        const menu = document.createElement('div');
        menu.className = 'image-context-menu';
        menu.style.position = 'absolute';
        menu.style.background = 'white';
        menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        menu.style.padding = '8px';
        menu.style.borderRadius = '4px';
        menu.style.zIndex = '1000';
        
        // Add resize options
        const sizes = ['Small', 'Medium', 'Large', 'Original'];
        sizes.forEach(size => {
          const option = document.createElement('div');
          option.textContent = size;
          option.style.padding = '6px 12px';
          option.style.cursor = 'pointer';
          option.style.hover = 'background: #f3f4f6';
          
          option.onclick = () => {
            const initialWidth = parseInt(img.getAttribute('data-initial-width') || '300');
            const initialHeight = parseInt(img.getAttribute('data-initial-height') || '200');
            
            if (size === 'Small') {
              img.style.width = `${initialWidth * 0.5}px`;
            } else if (size === 'Medium') {
              img.style.width = `${initialWidth * 0.75}px`;
            } else if (size === 'Large') {
              img.style.width = `${initialWidth}px`;
            } else {
              // Original - remove styles
              img.style.width = '';
            }
            
            onChange(editorRef.current!.innerHTML);
            document.body.removeChild(menu);
          };
          
          menu.appendChild(option);
        });
        
        // Position the menu
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        document.body.appendChild(menu);
        
        // Close menu when clicking outside
        const closeMenu = () => {
          if (document.body.contains(menu)) {
            document.body.removeChild(menu);
          }
          document.removeEventListener('click', closeMenu);
        };
        
        setTimeout(() => {
          document.addEventListener('click', closeMenu);
        }, 100);
        
        return false;
      };
    }
  }, [onChange]);

  // Add event listener for image handling when editor is focused
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('click', handleImageResize as unknown as EventListener);
    }
    
    return () => {
      if (editor) {
        editor.removeEventListener('click', handleImageResize as unknown as EventListener);
      }
    };
  }, [handleImageResize]);

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden bg-white shadow-sm">
      <EditorToolbar
        applyFormat={applyFormat}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
        linkPopoverOpen={linkPopoverOpen}
        setLinkPopoverOpen={setLinkPopoverOpen}
        handleLinkInsertion={handleLinkInsertion}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        imagePopoverOpen={imagePopoverOpen}
        setImagePopoverOpen={setImagePopoverOpen}
        handleImageUrlInsertion={handleImageUrlInsertion}
        handleImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
        fontOptionsOpen={fontOptionsOpen}
        setFontOptionsOpen={setFontOptionsOpen}
        colorPopoverOpen={colorPopoverOpen}
        setColorPopoverOpen={setColorPopoverOpen}
        lineHeightPopoverOpen={lineHeightPopoverOpen}
        setLineHeightPopoverOpen={setLineHeightPopoverOpen}
        handleFontFamilyChange={handleFontFamilyChange}
        handleFontSizeChange={handleFontSizeChange}
        handleColorChange={handleColorChange}
        handleLineHeightChange={handleLineHeightChange}
      />
      
      <div
        ref={editorRef}
        className="content p-5 min-h-[400px] focus:outline-none prose max-w-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorState }}
        onBlur={handleContentChange}
        onInput={handleContentChange}
        dir="ltr"
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#333333',
          position: 'relative'
        }}
      />

      <style jsx>{`
        .rich-text-editor img {
          cursor: pointer;
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1rem 0;
        }
        .rich-text-editor img:hover {
          box-shadow: 0 0 0 2px #8B5CF6;
        }
        .rich-text-editor .image-context-menu div:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
