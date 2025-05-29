
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditorStyles from './editor/EditorStyles';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type Language = 'en' | 'zh';

interface MultilingualContent {
  en: {
    title: string;
    description: string;
    content: string;
    category: string;
    author_name: string;
  };
  zh: {
    title: string;
    description: string;
    content: string;
    category: string;
    author_name: string;
  };
}

interface MultilingualArticlePreviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: MultilingualContent;
  imagePreview: string | null;
}

const MultilingualArticlePreviewDialog: React.FC<MultilingualArticlePreviewDialogProps> = ({
  open,
  setOpen,
  content,
  imagePreview
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  
  const currentContent = content[selectedLanguage];
  
  // Check which languages have content
  const hasEnglishContent = content.en.title?.trim() || content.en.content?.trim();
  const hasChineseContent = content.zh.title?.trim() || content.zh.content?.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Article Preview
              </DialogTitle>
              <div className="flex gap-2">
                {hasEnglishContent && (
                  <Badge variant="secondary" className="text-xs">
                    English
                  </Badge>
                )}
                {hasChineseContent && (
                  <Badge variant="secondary" className="text-xs">
                    中文
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Language Selector */}
          <div className="mt-4">
            <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
              <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="en"
                  disabled={!hasEnglishContent}
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-sm text-gray-400 font-light transition-all duration-200 rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  English
                </TabsTrigger>
                <TabsTrigger 
                  value="zh"
                  disabled={!hasChineseContent}
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-sm text-gray-400 font-light transition-all duration-200 rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  中文
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>
        
        <div className="p-8 space-y-8">
          {imagePreview && (
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-md">
              <img
                src={imagePreview}
                alt={currentContent.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.title || `No ${selectedLanguage === 'en' ? 'English' : 'Chinese'} title`}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {currentContent.category && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                  {currentContent.category}
                </span>
              )}
              
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                {format(new Date(), 'MMMM d, yyyy')}
              </span>
              
              {currentContent.author_name && (
                <span className="flex items-center">
                  By <span className="font-medium ml-1">{currentContent.author_name}</span>
                </span>
              )}
            </div>
          </div>
          
          {currentContent.description && (
            <div className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
              {currentContent.description}
            </div>
          )}
          
          <div className="rich-text-editor prose max-w-none">
            <div
              className="content bg-white p-6 rounded-lg border border-gray-100"
              dangerouslySetInnerHTML={{ 
                __html: currentContent.content || `<p>No ${selectedLanguage === 'en' ? 'English' : 'Chinese'} content available</p>` 
              }}
            />
          </div>
        </div>
        
        <EditorStyles />
      </DialogContent>
    </Dialog>
  );
};

export default MultilingualArticlePreviewDialog;
