
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditorStyles from './editor/EditorStyles';
import { File, Download } from 'lucide-react';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Article Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {imagePreview && (
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              <img
                src={imagePreview}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {category && <span>{category}</span>}
              {getFormattedAuthorNames() && (
                <span>By {getFormattedAuthorNames()}</span>
              )}
            </div>
          </div>
          
          <p className="text-gray-700">{description}</p>
          
          <div className="rich-text-editor">
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          
          {attachments && attachments.length > 0 && (
            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium mb-2">Attachments</h3>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    {attachment.url && (
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
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
