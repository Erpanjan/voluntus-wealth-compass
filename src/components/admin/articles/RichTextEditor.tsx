
import React from 'react';
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
        fontOptionsOpen={false} // This isn't used anymore but still in the interface
        setFontOptionsOpen={() => {}} // This isn't used anymore but still in the interface
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

