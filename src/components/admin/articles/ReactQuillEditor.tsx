
import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ReactQuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ReactQuillEditor: React.FC<ReactQuillEditorProps> = ({ value, onChange }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'script',
    'code-block'
  ];

  return (
    <div className="react-quill-editor">
      <style dangerouslySetInnerHTML={{
        __html: `
          .react-quill-editor .ql-editor {
            min-height: 400px !important;
            font-family: 'Poppins', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.8 !important;
            color: #333333 !important;
            padding: 24px !important;
          }
          
          .react-quill-editor .ql-toolbar {
            border-top: 1px solid #e5e7eb !important;
            border-left: 1px solid #e5e7eb !important;
            border-right: 1px solid #e5e7eb !important;
            border-bottom: 1px solid #e5e7eb !important;
            background: #F6F6F7 !important;
            padding: 12px !important;
            border-radius: 8px 8px 0 0 !important;
          }
          
          .react-quill-editor .ql-container {
            border-left: 1px solid #e5e7eb !important;
            border-right: 1px solid #e5e7eb !important;
            border-bottom: 1px solid #e5e7eb !important;
            border-radius: 0 0 8px 8px !important;
            background: white !important;
          }
          
          .react-quill-editor .ql-editor.ql-blank::before {
            content: 'Start writing your article content...' !important;
            color: #9ca3af !important;
            font-style: italic !important;
          }
          
          .react-quill-editor .ql-toolbar .ql-formats {
            margin-right: 8px !important;
          }
          
          .react-quill-editor .ql-toolbar button {
            border-radius: 4px !important;
            margin: 2px !important;
            padding: 6px 8px !important;
            transition: all 0.2s !important;
          }
          
          .react-quill-editor .ql-toolbar button:hover {
            background: #f9fafb !important;
          }
          
          .react-quill-editor .ql-toolbar button.ql-active {
            background: #e5e7eb !important;
          }
        `
      }} />
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your article content..."
      />
    </div>
  );
};

export default ReactQuillEditor;
