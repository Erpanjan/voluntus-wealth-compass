
import React from 'react';
import CKEditor4 from './CKEditor4';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * @deprecated This component has been replaced with CKEditor4. 
 * Please use CKEditor4 component directly.
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  console.warn('RichTextEditor is deprecated. Please use CKEditor4 component directly.');
  
  return <CKEditor4 value={value} onChange={onChange} />;
};

export default RichTextEditor;
