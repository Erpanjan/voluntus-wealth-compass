
import React from 'react';
import DraftEditor from './DraftEditor';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditorContent: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return <DraftEditor value={value} onChange={onChange} />;
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
