
import React, { useEffect } from 'react';
import { useRichTextEditor } from '@/hooks/editor';
import EditorToolbar from './editor/EditorToolbar';
import ImageHandler from './editor/ImageHandler';
import EditorStyles from './editor/EditorStyles';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditorContent: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useRichTextEditor({
    initialValue: value,
    onChange
  });
  
  // Apply our proper list styling when the editor first loads
  useEffect(() => {
    if (editor.editorRef.current) {
      // Give browser time to render the content first
      setTimeout(() => {
        try {
          // Find all existing lists and apply proper styling
          const lists = editor.editorRef.current?.querySelectorAll('ul, ol');
          lists?.forEach(list => {
            if (list.tagName === 'UL' || list.tagName === 'OL') {
              (list as HTMLElement).style.paddingLeft = '2em';
              (list as HTMLElement).style.marginTop = '0.5em';
              (list as HTMLElement).style.marginBottom = '1em';
              
              // Style list items too
              const items = list.querySelectorAll('li');
              items.forEach(item => {
                (item as HTMLElement).style.marginBottom = '0.5em';
                (item as HTMLElement).style.lineHeight = '1.6';
              });
            }
          });
        } catch (error) {
          console.error('Error applying list styling:', error);
        }
      }, 100);
    }
  }, [value, editor.editorRef]);

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden bg-white shadow-sm">
      <EditorToolbar
        applyFormat={editor.applyFormat}
        linkUrl={editor.linkUrl}
        setLinkUrl={editor.setLinkUrl}
        linkPopoverOpen={editor.linkPopoverOpen}
        setLinkPopoverOpen={editor.setLinkPopoverOpen}
        handleLinkInsertion={editor.handleLinkInsertion}
        imageUrl={editor.imageUrl}
        setImageUrl={editor.setImageUrl}
        imagePopoverOpen={editor.imagePopoverOpen}
        setImagePopoverOpen={editor.setImagePopoverOpen}
        handleImageUrlInsertion={editor.handleImageUrlInsertion}
        handleImageUpload={editor.handleImageUpload}
        fileInputRef={editor.fileInputRef}
        fontOptionsOpen={false} 
        setFontOptionsOpen={() => {}}
        colorPopoverOpen={editor.colorPopoverOpen}
        setColorPopoverOpen={editor.setColorPopoverOpen}
        lineHeightPopoverOpen={editor.lineHeightPopoverOpen}
        setLineHeightPopoverOpen={editor.setLineHeightPopoverOpen}
        handleFontFamilyChange={editor.handleFontFamilyChange}
        handleFontSizeChange={editor.handleFontSizeChange}
        handleColorChange={editor.handleColorChange}
        handleLineHeightChange={editor.handleLineHeightChange}
      />
      
      <div
        ref={editor.editorRef}
        className="content p-6 min-h-[400px] focus:outline-none prose max-w-none"
        contentEditable
        onInput={editor.handleContentChange}
        onPaste={editor.handlePaste}
        onBlur={editor.handleContentBlur}
        suppressContentEditableWarning={true}
        dir="ltr"
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#333333',
          position: 'relative'
        }}
      />

      {/* Handle image resizing */}
      <ImageHandler 
        editorRef={editor.editorRef}
        onChange={onChange}
      />
      
      {/* Apply editor styles */}
      <EditorStyles />
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="border rounded-md p-6 bg-red-50 text-red-700">
          <h3 className="font-medium mb-2">Editor Error</h3>
          <p className="text-sm">The rich text editor encountered an error. Please refresh the page and try again.</p>
        </div>
      }
    >
      <RichTextEditorContent value={value} onChange={onChange} />
    </ErrorBoundary>
  );
};

export default RichTextEditor;
