
import React from 'react';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface ArticleContentEditorProps {
  htmlContent: string;
  setHtmlContent: (content: string) => void;
}

const ArticleContentEditor = ({ htmlContent, setHtmlContent }: ArticleContentEditorProps) => {
  // Calculate reading stats
  const countWords = (html: string): number => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, ' ');
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };
  
  const wordCount = countWords(htmlContent);
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Label className="text-lg font-semibold">Article Content</Label>
          <p className="text-sm text-muted-foreground">
            Use the toolbar to format your content and insert media
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Info size={12} />
            <span>{wordCount} words</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Info size={12} />
            <span>~{readingTimeMinutes} min read</span>
          </Badge>
        </div>
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
        <p className="mt-1">
          Pro tip: Use headings to structure your article for better readability and SEO.
        </p>
      </div>
    </div>
  );
};

export default ArticleContentEditor;
