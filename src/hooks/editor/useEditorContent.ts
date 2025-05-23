
import { useState, useEffect, useCallback } from 'react';

interface UseEditorContentProps {
  initialValue: string;
  editorRef: React.RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
}

export const useEditorContent = ({ initialValue, editorRef, onChange }: UseEditorContentProps) => {
  const [editorState, setEditorState] = useState(initialValue || '');

  // Clean Microsoft Word and other problematic formatting
  const cleanContent = useCallback((html: string): string => {
    if (!html) return '';
    
    try {
      // Create a temporary div to manipulate the HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Remove Microsoft Word specific elements and attributes - FIXED SELECTOR
      const elementsToRemove = temp.querySelectorAll('meta, link, style, title, xml');
      elementsToRemove.forEach(el => el.remove());
      
      // Remove Office-specific namespaced elements separately
      const officeElements = temp.querySelectorAll('[class*="Mso"], [style*="mso-"]');
      officeElements.forEach(el => el.remove());
      
      // Remove problematic attributes
      const allElements = temp.querySelectorAll('*');
      allElements.forEach(el => {
        // Remove style attributes that contain Word-specific styles
        const style = el.getAttribute('style');
        if (style && (
          style.includes('mso-') || 
          style.includes('tab-stops') || 
          style.includes('margin:0cm') ||
          style.includes('font-family:"Calibri"')
        )) {
          el.removeAttribute('style');
        }
        
        // Remove Word-specific attributes
        const attributesToRemove = [
          'class', 'lang', 'xml:lang', 'xmlns', 'xmlns:w', 'xmlns:o', 'xmlns:m', 'xmlns:v',
          'data-listid', 'data-list', 'data-level', 'data-font', 'data-fontsize'
        ];
        
        attributesToRemove.forEach(attr => {
          if (el.hasAttribute(attr)) {
            const value = el.getAttribute(attr);
            if (value && (value.includes('Mso') || value.includes('Word') || value.includes('List'))) {
              el.removeAttribute(attr);
            }
          }
        });
      });
      
      // Remove empty paragraphs and spans
      const emptyElements = temp.querySelectorAll('p:empty, span:empty, div:empty');
      emptyElements.forEach(el => el.remove());
      
      // Convert Word-style lists to proper HTML lists
      const wordLists = temp.querySelectorAll('p[style*="text-indent"], p[style*="margin-left"]');
      wordLists.forEach(p => {
        const text = p.textContent?.trim();
        if (text && (text.startsWith('·') || text.startsWith('•') || /^\d+\./.test(text))) {
          const li = document.createElement('li');
          li.innerHTML = p.innerHTML.replace(/^[·•]\s*|\d+\.\s*/, '');
          p.replaceWith(li);
        }
      });
      
      return temp.innerHTML;
    } catch (error) {
      console.error('Error cleaning content:', error);
      // Return the original content if cleaning fails
      return html;
    }
  }, []);

  // Set initial content when component mounts or initialValue changes
  useEffect(() => {
    if (editorRef.current && initialValue !== editorState) {
      try {
        const cleanedContent = cleanContent(initialValue);
        editorRef.current.innerHTML = cleanedContent;
        setEditorState(cleanedContent);
      } catch (error) {
        console.error('Error setting initial content:', error);
      }
    }
  }, [initialValue, cleanContent, editorRef]);

  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;
    
    try {
      const rawContent = editorRef.current.innerHTML;
      const cleanedContent = cleanContent(rawContent);
      
      // Only update if content actually changed
      if (cleanedContent !== editorState) {
        setEditorState(cleanedContent);
        onChange(cleanedContent);
      }
    } catch (error) {
      console.error('Error handling content change:', error);
    }
  }, [editorState, onChange, cleanContent, editorRef]);

  const handleContentBlur = useCallback(() => {
    if (!editorRef.current) return;
    
    try {
      const finalContent = cleanContent(editorRef.current.innerHTML);
      
      // Clean up the editor content on blur
      editorRef.current.innerHTML = finalContent;
      setEditorState(finalContent);
      onChange(finalContent);
    } catch (error) {
      console.error('Error handling content blur:', error);
    }
  }, [onChange, cleanContent, editorRef]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    
    try {
      // Get plain text and HTML data
      const clipboardData = e.clipboardData;
      const htmlData = clipboardData.getData('text/html');
      const textData = clipboardData.getData('text/plain');
      
      let contentToInsert = '';
      
      if (htmlData) {
        // Clean the HTML content before inserting
        contentToInsert = cleanContent(htmlData);
      } else if (textData) {
        // Convert plain text to HTML, preserving line breaks
        contentToInsert = textData.replace(/\n/g, '<br>');
      }
      
      if (contentToInsert) {
        // Insert the cleaned content at cursor position
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          // Create a temporary element to hold the content
          const temp = document.createElement('div');
          temp.innerHTML = contentToInsert;
          
          // Insert each child node
          const fragment = document.createDocumentFragment();
          while (temp.firstChild) {
            fragment.appendChild(temp.firstChild);
          }
          
          range.insertNode(fragment);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // Trigger content change
        setTimeout(() => handleContentChange(), 0);
      }
    } catch (error) {
      console.error('Error handling paste:', error);
    }
  }, [cleanContent, handleContentChange]);

  return {
    editorState,
    handleContentChange,
    handleContentBlur,
    handlePaste
  };
};
