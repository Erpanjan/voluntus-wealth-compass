
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Save, Send } from 'lucide-react';

interface ArticlePublishingOptionsProps {
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublishNow: () => void;
}

const ArticlePublishingOptions: React.FC<ArticlePublishingOptionsProps> = ({
  onPreview,
  onSaveDraft,
  onPublishNow
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Options</CardTitle>
        <CardDescription>
          Ways to share your article
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="sm" className="justify-start" onClick={onPreview}>
            <Eye size={16} className="mr-2" /> Preview Article
          </Button>
          <p className="text-xs text-muted-foreground">
            See how your article will look when published
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="sm" className="justify-start" onClick={onSaveDraft}>
            <Save size={16} className="mr-2" /> Save as Draft
          </Button>
          <p className="text-xs text-muted-foreground">
            Save your progress without publishing
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button size="sm" className="justify-start" onClick={onPublishNow}>
            <Send size={16} className="mr-2" /> Publish Now
          </Button>
          <p className="text-xs text-muted-foreground">
            Make your article visible to readers immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticlePublishingOptions;
