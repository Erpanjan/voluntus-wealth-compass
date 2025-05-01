
import React from 'react';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';

interface ArticleContentEditorProps {
  htmlContent: string;
  setHtmlContent: (content: string) => void;
}

const ArticleContentEditor = ({ htmlContent, setHtmlContent }: ArticleContentEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-semibold">Article Content</Label>
        <p className="text-sm text-muted-foreground">
          Use the toolbar to format your content and insert media
        </p>
      </div>
      
      <Card className="border rounded-md overflow-hidden">
        <CardContent className="p-0">
          <RichTextEditor
            value={htmlContent}
            onChange={setHtmlContent}
            placeholder="Write your article content here..."
          />
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>
          Format your content using the toolbar or keyboard shortcuts for a better reading experience.
        </p>
      </div>
    </div>
  );
};

export default ArticleContentEditor;
