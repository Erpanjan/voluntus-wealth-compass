
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css'; // We'll create this file for custom styling

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  placeholder = 'Start typing your content here...'
}) => {
  // For SSR compatibility
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }, { 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        // We could add custom handlers here if needed
      }
    },
    clipboard: {
      matchVisual: false, // Prevents weird paste behavior
    },
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function() {
            return true; // Let default tab behavior work
          }
        }
      }
    }
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align', 'indent',
    'blockquote', 'code-block',
    'script',
    'link', 'image', 'video'
  ];

  if (!mounted) {
    return (
      <div className="rich-editor-placeholder border rounded-md p-4 bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rich-editor-container">
      <div className="rich-text-editor-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[400px]"
        />
      </div>
      <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
        <span>Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline</span>
        <span>{value ? countWords(value) : 0} words</span>
      </div>
    </div>
  );
};

// Helper function to count words in the editor
const countWords = (html: string): number => {
  // Remove HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ');
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

export default RichTextEditor;
