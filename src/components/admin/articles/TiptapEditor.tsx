
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getEditorExtensions } from './editor/EditorExtensions';
import { useEditorState } from './editor/hooks/useEditorState';
import { useEditorHandlers } from './editor/hooks/useEditorHandlers';
import { useKeyboardShortcuts } from './editor/hooks/useKeyboardShortcuts';
import { getEditorProps } from './editor/EditorProps';
import EditorToolbar from './editor/EditorToolbar';
import EditorStylesComponent from './editor/EditorStylesComponent';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const editorState = useEditorState();
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: getEditorProps(editorState.isFullscreen),
  });

  // Update editor content when value prop changes (language switching)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      console.log('Editor content updating:', { currentContent: editor.getHTML(), newValue: value });
      editor.commands.setContent(value || '');
    }
  }, [editor, value]);

  const editorHandlers = useEditorHandlers({
    editor,
    ...editorState,
  });

  useKeyboardShortcuts(editor, editorState.setLinkPopoverOpen);

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
