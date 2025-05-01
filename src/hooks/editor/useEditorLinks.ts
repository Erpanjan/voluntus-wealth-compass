import { useState, useCallback, RefObject } from 'react';
import { toast } from '@/hooks/use-toast';
import { insertImageIntoEditor } from '@/utils/imageUtils';

interface UseEditorLinksProps {
  editorRef: RefObject<HTMLDivElement>;
  onChange: (value: string) => void;
}

export const useEditorLinks = ({ editorRef, onChange }: UseEditorLinksProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  
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

    document.execCommand('createLink', false, url);
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    
    setLinkUrl('');
    setLinkPopoverOpen(false);
    
    // Ensure editor keeps focus
    editorRef.current?.focus();
  }, [linkUrl, onChange, editorRef]);

  return {
    linkUrl,
    setLinkUrl,
    linkPopoverOpen,
    setLinkPopoverOpen,
    handleLinkInsertion
  };
};
