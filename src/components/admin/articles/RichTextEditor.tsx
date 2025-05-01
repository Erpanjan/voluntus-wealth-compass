
import React, { useEffect } from 'react';
import { useRichTextEditor } from '@/hooks/editor';
import EditorToolbar from './editor/EditorToolbar';
import ImageHandler from './editor/ImageHandler';
import EditorStyles from './editor/EditorStyles';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useRichTextEditor({
    initialValue: value,
    onChange
  });
  
  // Apply our proper list styling when the editor first loads
  useEffect(() => {
    if (editor.editorRef.current) {
      // Give browser time to render the content first
      setTimeout(() => {
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
        className="content p-5 min-h-[400px] focus:outline-none prose max-w-none"
        contentEditable
        onInput={editor.handleContentChange}
        onPaste={editor.handlePaste}
        onBlur={editor.handleContentBlur}
        suppressContentEditableWarning={true}
        dir="ltr"
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
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

export default RichTextEditor;
