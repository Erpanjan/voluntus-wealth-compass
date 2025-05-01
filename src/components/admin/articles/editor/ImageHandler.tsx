
import { useEffect, useCallback, RefObject } from 'react';

interface ImageHandlerProps {
  editorRef: RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
}

const ImageHandler: React.FC<ImageHandlerProps> = ({ editorRef, onChange }) => {
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
          
          // Use proper hover styling
          option.addEventListener('mouseover', () => {
            option.style.backgroundColor = '#f3f4f6';
          });
          option.addEventListener('mouseout', () => {
            option.style.backgroundColor = '';
          });
          
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
  }, [editorRef, onChange]);

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
  }, [handleImageResize, editorRef]);

  return null;
};

export default ImageHandler;
