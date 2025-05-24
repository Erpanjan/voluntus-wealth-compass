
import { useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';

interface UseEditorHandlersProps {
  editor: Editor | null;
  setLinkUrl: (url: string) => void;
  setLinkPopoverOpen: (open: boolean) => void;
  setImageUrl: (url: string) => void;
  setImagePopoverOpen: (open: boolean) => void;
  setVideoUrl: (url: string) => void;
  setVideoPopoverOpen: (open: boolean) => void;
  setColorPopoverOpen: (open: boolean) => void;
  setLineHeightPopoverOpen: (open: boolean) => void;
  linkUrl: string;
  imageUrl: string;
  videoUrl: string;
}

export const useEditorHandlers = ({
  editor,
  setLinkUrl,
  setLinkPopoverOpen,
  setImageUrl,
  setImagePopoverOpen,
  setVideoUrl,
  setVideoPopoverOpen,
  setColorPopoverOpen,
  setLineHeightPopoverOpen,
  linkUrl,
  imageUrl,
  videoUrl,
}: UseEditorHandlersProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFormat = useCallback((command: string, value?: string) => {
    if (!editor) return;

    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'superscript':
        editor.chain().focus().toggleSuperscript().run();
        break;
      case 'subscript':
        editor.chain().focus().toggleSubscript().run();
        break;
      case 'highlight':
        editor.chain().focus().toggleHighlight().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'taskList':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'alignLeft':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'alignCenter':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'alignRight':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'alignJustify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      case 'undo':
        editor.chain().focus().undo().run();
        break;
      case 'redo':
        editor.chain().focus().redo().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'heading4':
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case 'heading5':
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      case 'heading6':
        editor.chain().focus().toggleHeading({ level: 6 }).run();
        break;
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'horizontalRule':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'insertTable':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
      case 'indent':
        // Try to sink list item first, if that fails, use general indentation
        if (editor.isActive('listItem')) {
          editor.chain().focus().sinkListItem('listItem').run();
        } else {
          // For non-list content, apply margin-left styling
          const { from, to } = editor.state.selection;
          editor.chain().focus().setTextSelection({ from, to }).updateAttributes('paragraph', {
            style: 'margin-left: 2rem'
          }).run();
        }
        break;
      case 'outdent':
        // Try to lift list item first, if that fails, use general outdenting
        if (editor.isActive('listItem')) {
          editor.chain().focus().liftListItem('listItem').run();
        } else {
          // For non-list content, remove margin-left styling
          const { from, to } = editor.state.selection;
          editor.chain().focus().setTextSelection({ from, to }).updateAttributes('paragraph', {
            style: null
          }).run();
        }
        break;
    }
  }, [editor]);

  const handleLinkInsertion = useCallback(() => {
    if (!editor || !linkUrl) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetMark('link').run();
    } else {
      editor.chain().focus().extendMarkRange('link').setMark('link', { href: linkUrl }).run();
    }
    
    setLinkUrl('');
    setLinkPopoverOpen(false);
  }, [editor, linkUrl, setLinkUrl, setLinkPopoverOpen]);

  const handleImageUrlInsertion = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setImagePopoverOpen(false);
  }, [editor, imageUrl, setImageUrl, setImagePopoverOpen]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
    setImagePopoverOpen(false);
  }, [editor, setImagePopoverOpen]);

  const handleVideoInsertion = useCallback(() => {
    if (!editor || !videoUrl) return;

    editor.commands.setYoutubeVideo({
      src: videoUrl,
    });
    setVideoUrl('');
    setVideoPopoverOpen(false);
  }, [editor, videoUrl, setVideoUrl, setVideoPopoverOpen]);

  const handleFontFamilyChange = useCallback((value: string) => {
    if (!editor) return;
    if (value === 'default') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(value).run();
    }
  }, [editor]);

  const handleFontSizeChange = useCallback((value: string) => {
    if (!editor) return;
    if (value === 'default') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(value).run();
    }
  }, [editor]);

  const handleColorChange = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setColorPopoverOpen(false);
  }, [editor, setColorPopoverOpen]);

  const handleLineHeightChange = useCallback((height: string) => {
    if (!editor) return;
    // Apply line height to selected content
    const { from, to } = editor.state.selection;
    editor.chain().focus().setTextSelection({ from, to }).run();
    
    // Update CSS custom property for line height
    document.documentElement.style.setProperty('--editor-line-height', height);
    setLineHeightPopoverOpen(false);
  }, [editor, setLineHeightPopoverOpen]);

  return {
    applyFormat,
    handleLinkInsertion,
    handleImageUrlInsertion,
    handleImageUpload,
    handleVideoInsertion,
    handleFontFamilyChange,
    handleFontSizeChange,
    handleColorChange,
    handleLineHeightChange,
    fileInputRef,
  };
};
