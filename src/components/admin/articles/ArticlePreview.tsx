
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Smartphone, Monitor } from 'lucide-react';

interface ArticlePreviewProps {
  title: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  publishDate: string;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  content,
  author,
  category,
  imageUrl,
  publishDate
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye size={16} />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Article Preview</DialogTitle>
          <Tabs defaultValue="desktop" className="mt-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="desktop" className="flex items-center gap-1">
                  <Monitor size={14} />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-1">
                  <Smartphone size={14} />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="desktop" className="pt-4">
              <div className="article-preview">
                <div className="text-sm text-muted-foreground mb-2">
                  {category} • {publishDate} • By {author}
                </div>
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                
                {imageUrl && (
                  <div className="mb-6">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="pt-4">
              <div className="article-preview max-w-sm mx-auto border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-2">
                  {category} • {publishDate} • By {author}
                </div>
                <h1 className="text-xl font-bold mb-3">{title}</h1>
                
                {imageUrl && (
                  <div className="mb-4">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
                
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ArticlePreview;
