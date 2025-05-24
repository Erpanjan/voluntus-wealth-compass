
import { useEditorState } from './useEditorState';
import { useEditorContent } from './useEditorContent';
import { useEditorFormat } from './useEditorFormat';
import { useEditorLinks } from './useEditorLinks';
import { useEditorImages } from './useEditorImages';

interface UseRichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const useRichTextEditor = ({ initialValue, onChange }: UseRichTextEditorProps) => {
  // Get editor state (refs and UI state)
  const {
    editorRef,
    fileInputRef,
    colorPopoverOpen,
    setColorPopoverOpen,
    lineHeightPopoverOpen,
    setLineHeightPopoverOpen
  } = useEditorState();

  // Get editor content handling functions
  const {
    editorState,
    handleContentChange,
    handleContentBlur,
    handlePaste
  } = useEditorContent({
    initialValue,
    editorRef,
    onChange
  });

  // Get formatting functions
  const {
    applyFormat,
    handleFontFamilyChange,
    handleFontSizeChange,
    handleColorChange,
    handleLineHeightChange
  } = useEditorFormat({
    editorRef,
    onChange
  });

  // Get link handling functions
  const {
    linkUrl,
    setLinkUrl,
    linkPopoverOpen,
    setLinkPopoverOpen,
    handleLinkInsertion
  } = useEditorLinks({
    editorRef,
    onChange
  });

  // Get image handling functions
  const {
    imageUrl,
    setImageUrl,
    imagePopoverOpen,
    setImagePopoverOpen,
    handleImageUrlInsertion,
    handleImageUpload
  } = useEditorImages({
    editorRef,
    fileInputRef,
    onChange
  });

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
