
import React, { useEffect, useState, useCallback } from 'react';
import { Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import 'draft-js/dist/Draft.css';

interface DraftEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const DraftEditor: React.FC<DraftEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const contentState = stateFromHTML(value);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  // Update editor state when value prop changes
  useEffect(() => {
    if (value) {
      const contentState = stateFromHTML(value);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  // Handle editor state changes
  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);
    
    // Convert to HTML and call onChange
    const contentState = newEditorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    onChange(htmlContent);
  }, [onChange]);

  // Handle key commands
  const handleKeyCommand = useCallback((command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }, [handleEditorChange]);

  // Toggle inline styles
  const toggleInlineStyle = useCallback((style: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  }, [editorState, handleEditorChange]);

  // Toggle block type
  const toggleBlockType = useCallback((blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  }, [editorState, handleEditorChange]);

  return (
    <div className="draft-editor border rounded-md overflow-hidden bg-white shadow-sm">
      {/* Simple toolbar for essential formatting */}
      <div className="toolbar bg-[#F6F6F7] p-3 border-b flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle('BOLD');
          }}
        >
          Bold
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle('ITALIC');
          }}
        >
          Italic
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle('UNDERLINE');
          }}
        >
          Underline
        </button>
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType('header-one');
          }}
        >
          H1
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType('header-two');
          }}
        >
          H2
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType('unordered-list-item');
          }}
        >
          • List
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType('ordered-list-item');
          }}
        >
          1. List
        </button>
      </div>
      
      {/* Editor content area */}
      <div 
        className="content p-6 min-h-[400px] focus:outline-none"
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#333333',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="Start writing your article content..."
        />
      </div>
    </div>
  );
};

export default DraftEditor;
