
import React from 'react';
import ReactQuillEditor from './ReactQuillEditor';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditorContent: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return <ReactQuillEditor value={value} onChange={onChange} />;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="border rounded-md p-6 bg-red-50 text-red-700">
          <h3 className="font-medium mb-2">Editor Error</h3>
          <p className="text-sm mb-3">The rich text editor encountered an error. Using fallback text editor.</p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['Poppins'] text-base leading-relaxed"
            placeholder="Start writing your article content..."
          />
        </div>
      }
    >
      <RichTextEditorContent value={value} onChange={onChange} />
    </ErrorBoundary>
  );
};

export default RichTextEditor;
