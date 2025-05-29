
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EditorStyles from './editor/EditorStyles';
import { File, Download, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Author {
  id?: string;
  name: string;
  image_url?: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

interface MultilingualContent {
  title: string;
  description: string;
  content: string;
  category: string;
  author_name: string;
}

interface ArticlePreviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  multilingualData: {
    en: MultilingualContent;
    zh: MultilingualContent;
  };
  imagePreview: string | null;
  attachments?: Attachment[];
}

const ArticlePreviewDialog: React.FC<ArticlePreviewDialogProps> = ({
  open,
  setOpen,
  multilingualData,
  imagePreview,
  attachments = []
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'zh'>('en');
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderArticleContent = (content: MultilingualContent) => (
    <div className="space-y-8">
      {imagePreview && (
        <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-md">
          <img
            src={imagePreview}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          {content.category && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
              {content.category}
            </span>
          )}
          
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5" />
            {format(new Date(), 'MMMM d, yyyy')}
          </span>
          
          {content.author_name && (
            <span className="flex items-center">
              By <span className="font-medium ml-1">{content.author_name}</span>
            </span>
          )}
        </div>
      </div>
      
      {content.description && (
        <div className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
          {content.description}
        </div>
      )}
      
      <div className="rich-text-editor prose max-w-none">
        <div
          className="content bg-white p-6 rounded-lg border border-gray-100"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-gray-800">Article Preview</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'en' | 'zh')}>
              <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="en"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-sm text-gray-400 font-light transition-all duration-200 rounded-md px-4 py-2"
                >
                  English
                </TabsTrigger>
                <TabsTrigger 
                  value="zh"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-sm text-gray-400 font-light transition-all duration-200 rounded-md px-4 py-2"
                >
                  中文
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>
        
        <div className="p-8">
          <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'en' | 'zh')}>
            <TabsContent value="en" className="mt-0">
              {renderArticleContent(multilingualData.en)}
            </TabsContent>
            <TabsContent value="zh" className="mt-0">
              {renderArticleContent(multilingualData.zh)}
            </TabsContent>
          </Tabs>
          
          {attachments && attachments.length > 0 && (
            <div className="border-t pt-8 mt-8">
              <h3 className="font-medium text-lg mb-4 text-gray-800">Attachments</h3>
              <div className="grid gap-3">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <File className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    {attachment.url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="gap-2"
                      >
                        <a 
                          href={attachment.url} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <EditorStyles />
      </DialogContent>
    </Dialog>
  );
};

export default ArticlePreviewDialog;
