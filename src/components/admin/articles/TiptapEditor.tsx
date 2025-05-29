
import React, { useEffect, useRef } from 'react';
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
  languageKey?: string; // Add language key to track language switches
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, languageKey }) => {
  const editorState = useEditorState();
  const currentLanguageRef = useRef<string | undefined>(languageKey);
  const userIsEditingRef = useRef(false);
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: '<p></p>',
    onUpdate: ({ editor }) => {
      userIsEditingRef.current = true;
      const html = editor.getHTML();
      onChange(html);
    },
    onFocus: () => {
      userIsEditingRef.current = true;
    },
    editorProps: getEditorProps(editorState.isFullscreen),
  });

  // Handle language switching - clear editing flag and load new content
  useEffect(() => {
    if (editor && languageKey && currentLanguageRef.current !== languageKey) {
      console.log('🌍 [TIPTAP] Language switch detected:', {
        from: currentLanguageRef.current,
        to: languageKey,
        newContentLength: value?.length || 0
      });
      
      // Reset editing state for language switch
      userIsEditingRef.current = false;
      currentLanguageRef.current = languageKey;
      
      // Set content for new language
      if (value && value !== '<p></p>') {
        editor.commands.setContent(value, false);
      } else {
        editor.commands.setContent('<p></p>', false);
      }
    }
  }, [editor, languageKey, value]);

  // Handle initial content loading (only when not editing)
  useEffect(() => {
    if (editor && value && value !== '<p></p>' && !userIsEditingRef.current) {
      const currentContent = editor.getHTML();
      
      // Only update if content is significantly different
      if (currentContent !== value && Math.abs(currentContent.length - value.length) > 10) {
        console.log('🔄 [TIPTAP] Loading content:', {
          valueLength: value.length,
          valuePreview: value.substring(0, 100) + '...',
        });
        editor.commands.setContent(value, false);
      }
    }
  }, [editor, value]);

  const editorHandlers = useEditorHandlers({
    editor,
    ...editorState,
  });

  useKeyboardShortcuts(editor, editorState.setLinkPopoverOpen);

  if (!editor) {
    return (
      <div className="border rounded-md bg-white shadow-sm p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
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
