
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getEditorExtensions } from './editor/EditorExtensions';
import { useEditorState } from './editor/hooks/useEditorState';
import { useEditorHandlers } from './editor/hooks/useEditorHandlers';
import { useKeyboardShortcuts } from './editor/hooks/useKeyboardShortcuts';
import { getEditorProps } from './editor/EditorProps';
import EditorToolbar from './editor/EditorToolbar';
import EditorStylesComponent from './editor/EditorStylesComponent';

interface TiptapEditorProps {
  value: string | { _type?: string; value?: string } | any;
  onChange: (value: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const editorState = useEditorState();
  
  // Handle different value formats - extract string content
  const getStringValue = (val: any): string => {
    if (typeof val === 'string') {
      return val;
    }
    if (val && typeof val === 'object' && val.value && typeof val.value === 'string') {
      return val.value;
    }
    return '';
  };

  const stringValue = getStringValue(value);
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: stringValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: getEditorProps(editorState.isFullscreen),
  });

  const editorHandlers = useEditorHandlers({
    editor,
    ...editorState,
  });

  useKeyboardShortcuts(editor, editorState.setLinkPopoverOpen);

  // Handle value prop changes to update editor content
  React.useEffect(() => {
    const currentStringValue = getStringValue(value);
    if (editor && currentStringValue !== editor.getHTML()) {
      console.log('TiptapEditor: Updating content from prop value:', typeof currentStringValue === 'string' ? currentStringValue.substring(0, 100) + '...' : 'Not a string');
      editor.commands.setContent(currentStringValue || '', false);
    }
  }, [value, editor]);

  // Force editor to update when key changes (language switch)
  React.useEffect(() => {
    if (editor) {
      const currentStringValue = getStringValue(value);
      console.log('TiptapEditor: Editor re-mounted, setting content:', typeof currentStringValue === 'string' ? currentStringValue.substring(0, 100) + '...' : 'Not a string');
      editor.commands.setContent(currentStringValue || '', false);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-md bg-white shadow-sm transition-all duration-300 ${
      editorState.isFullscreen ? 'fixed inset-4 z-50 max-w-none' : ''
    }`}>
      <EditorToolbar 
        applyFormat={editorHandlers.applyFormat}
        linkUrl={editorState.linkUrl}
        setLinkUrl={editorState.setLinkUrl}
        linkPopoverOpen={editorState.linkPopoverOpen}
        setLinkPopoverOpen={editorState.setLinkPopoverOpen}
        handleLinkInsertion={editorHandlers.handleLinkInsertion}
        imageUrl={editorState.imageUrl}
        setImageUrl={editorState.setImageUrl}
        imagePopoverOpen={editorState.imagePopoverOpen}
        setImagePopoverOpen={editorState.setImagePopoverOpen}
        handleImageUrlInsertion={editorHandlers.handleImageUrlInsertion}
        handleImageUpload={editorHandlers.handleImageUpload}
        fileInputRef={editorHandlers.fileInputRef}
        videoUrl={editorState.videoUrl}
        setVideoUrl={editorState.setVideoUrl}
        videoPopoverOpen={editorState.videoPopoverOpen}
        setVideoPopoverOpen={editorState.setVideoPopoverOpen}
        handleVideoInsertion={editorHandlers.handleVideoInsertion}
        fontOptionsOpen={editorState.fontOptionsOpen}
        setFontOptionsOpen={editorState.setFontOptionsOpen}
        colorPopoverOpen={editorState.colorPopoverOpen}
        setColorPopoverOpen={editorState.setColorPopoverOpen}
        lineHeightPopoverOpen={editorState.lineHeightPopoverOpen}
        setLineHeightPopoverOpen={editorState.setLineHeightPopoverOpen}
        handleFontFamilyChange={editorHandlers.handleFontFamilyChange}
        handleFontSizeChange={editorHandlers.handleFontSizeChange}
        handleColorChange={editorHandlers.handleColorChange}
        handleLineHeightChange={editorHandlers.handleLineHeightChange}
        isFullscreen={editorState.isFullscreen}
        toggleFullscreen={editorState.toggleFullscreen}
      />
      <EditorContent 
        editor={editor} 
        className={`transition-all duration-300 ${
          editorState.isFullscreen ? 'min-h-[calc(80vh-60px)]' : 'min-h-[400px]'
        }`}
      />
      
      <EditorStylesComponent />
    </div>
  );
};

export default TiptapEditor;
