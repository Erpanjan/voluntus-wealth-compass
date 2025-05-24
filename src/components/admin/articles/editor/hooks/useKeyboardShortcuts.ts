
import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

export const useKeyboardShortcuts = (
  editor: Editor | null,
  setLinkPopoverOpen: (open: boolean) => void
) => {
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case 'i':
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case 'u':
            event.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            break;
          case 'k':
            event.preventDefault();
            setLinkPopoverOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, setLinkPopoverOpen]);
};
