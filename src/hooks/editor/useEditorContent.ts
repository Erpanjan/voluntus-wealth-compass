import { useState, useCallback, RefObject } from 'react';

interface UseEditorContentProps {
  initialValue: string;
  editorRef: RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
}

export const useEditorContent = ({ initialValue, editorRef, onChange }: UseEditorContentProps) => {
  const [editorState, setEditorState] = useState(initialValue || '');

  // Handle content change - modified to fix cursor position issues
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorState(newContent);
      onChange(newContent);
    }
  }, [onChange, editorRef]);

  // Handle content blur - separated from handleContentChange
  const handleContentBlur = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, editorRef]);

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
  }, [onChange, editorRef]);

  return {
    editorState,
    handleContentChange,
    handleContentBlur,
    handlePaste
  };
};
