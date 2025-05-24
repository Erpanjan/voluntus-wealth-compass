import { useCallback, RefObject } from 'react';

interface UseEditorFormatProps {
  editorRef: RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
}

export const useEditorFormat = ({ editorRef, onChange }: UseEditorFormatProps) => {
  // Apply formatting to selected text
  const applyFormat = useCallback((command: string, value: string | undefined = undefined) => {
    // Execute the command
    document.execCommand(command, false, value);
    
    // Special handling for list formatting to ensure proper spacing and styling
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      // Allow browser to render the list
      setTimeout(() => {
        if (editorRef.current) {
          // Find all lists in the editor
          const lists = editorRef.current.querySelectorAll('ul, ol');
          
          // Apply proper spacing to each list
          lists.forEach(list => {
            // Ensure list items have proper styling
            const items = list.querySelectorAll('li');
            items.forEach(item => {
              item.style.marginBottom = '0.5em';
            });
            
            // Add margin to the list itself
            if (list.tagName === 'UL') {
              (list as HTMLElement).style.paddingLeft = '2em';
              (list as HTMLElement).style.marginTop = '0.5em';
              (list as HTMLElement).style.marginBottom = '1em';
            } else if (list.tagName === 'OL') {
              (list as HTMLElement).style.paddingLeft = '2em';
              (list as HTMLElement).style.marginTop = '0.5em';
              (list as HTMLElement).style.marginBottom = '1em';
            }
          });
          
          // Update the form value after styling
          onChange(editorRef.current.innerHTML);
        }
      }, 10);
    } else if (command === 'indent' || command === 'outdent') {
      // Handle indentation specifically
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          // Find the current list item if we're in a list
          let listItem = null;
          let node = selection.anchorNode;
          
          while (node && node !== editorRef.current) {
            if (node.nodeName === 'LI') {
              listItem = node;
              break;
            }
            node = node.parentNode;
          }
          
          // Apply additional styling for nested lists
          if (listItem) {
            // Find parent list
            const parentList = listItem.parentNode;
            if (parentList) {
              if (parentList.nodeName === 'UL') {
                (parentList as HTMLElement).style.paddingLeft = '1.5em';
              } else if (parentList.nodeName === 'OL') {
                (parentList as HTMLElement).style.paddingLeft = '1.5em';
              }
            }
          }
        }
      }
    }
    
    // Update form value
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    
    // Ensure editor keeps focus
    editorRef.current?.focus();
  }, [onChange, editorRef]);

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
  }, [onChange, editorRef]);

  return {
    applyFormat,
    handleFontFamilyChange,
    handleFontSizeChange,
    handleColorChange,
    handleLineHeightChange
  };
};
