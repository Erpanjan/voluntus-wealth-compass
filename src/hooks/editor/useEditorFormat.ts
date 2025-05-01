import { useCallback, RefObject } from 'react';

interface UseEditorFormatProps {
  editorRef: RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
}

export const useEditorFormat = ({ editorRef, onChange }: UseEditorFormatProps) => {
  // Apply formatting to selected text
  const applyFormat = useCallback((command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    
    if (editorRef.current) {
      // Update the form value
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
