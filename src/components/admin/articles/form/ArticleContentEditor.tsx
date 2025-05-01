
import React from 'react';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, Link, Image } from 'lucide-react';

interface ArticleContentEditorProps {
  htmlContent: string;
  setHtmlContent: (content: string) => void;
}

const ArticleContentEditor = ({ htmlContent, setHtmlContent }: ArticleContentEditorProps) => {
  // Function to handle keyboard shortcuts as an alternative to the Quill toolbar
  const handleKeyboardShortcut = (formatType: string) => {
    // This function serves as a visual reference for keyboard shortcuts
    // The actual formatting will be handled by ReactQuill's built-in shortcuts
    console.log(`Keyboard shortcut for ${formatType} triggered`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Article Content</Label>
        
        <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
          <span>Shortcuts:</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={() => handleKeyboardShortcut('bold')}
          >
            <Bold size={14} className="mr-1" /> Ctrl+B
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={() => handleKeyboardShortcut('italic')}
          >
            <Italic size={14} className="mr-1" /> Ctrl+I
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={() => handleKeyboardShortcut('link')}
          >
            <Link size={14} className="mr-1" /> Ctrl+K
          </Button>
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
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>
          Use the toolbar to format your content or insert media
        </p>
        {htmlContent && (
          <p>
            {htmlContent.length > 0 ? htmlContent.replace(/<[^>]*>/g, '').length : 0} characters
          </p>
        )}
      </div>
    </div>
  );
};

export default ArticleContentEditor;
