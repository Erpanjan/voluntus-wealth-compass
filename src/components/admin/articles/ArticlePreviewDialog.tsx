
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface ArticlePreviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  content: string;
  imagePreview: string | null;
  category: string;
  authors: string[] | Author[];
  attachments?: Attachment[];
}

const ArticlePreviewDialog: React.FC<ArticlePreviewDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  content,
  imagePreview,
  category,
  authors,
  attachments = []
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFormattedAuthorNames = () => {
    if (authors.length === 0) return '';
    
    if (typeof authors[0] === 'string') {
      return (authors as string[]).join(', ');
    } else {
      return (authors as Author[]).map(author => author.name).join(', ');
    }
  };

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
        </DialogHeader>
        
        <div className="p-8 space-y-8">
          {imagePreview && (
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-md">
              <img
                src={imagePreview}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {category && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                  {category}
                </span>
              )}
              
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                {format(new Date(), 'MMMM d, yyyy')}
              </span>
              
              {getFormattedAuthorNames() && (
                <span className="flex items-center">
                  By <span className="font-medium ml-1">{getFormattedAuthorNames()}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
            {description}
          </div>
          
          <div className="rich-text-editor prose max-w-none">
            <div
              className="content bg-white p-6 rounded-lg border border-gray-100"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          
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
