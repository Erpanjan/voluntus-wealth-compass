
import React from 'react';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface ArticleContentEditorProps {
  htmlContent: string;
  setHtmlContent: (content: string) => void;
}

const ArticleContentEditor = ({ htmlContent, setHtmlContent }: ArticleContentEditorProps) => {
  return (
    <div className="space-y-2">
      <Label>Article Content</Label>
      <RichTextEditor
        value={htmlContent}
        onChange={setHtmlContent}
      />
      <p className="text-sm text-muted-foreground">
        Create and format your article content
      </p>
    </div>
  );
};

export default ArticleContentEditor;
