
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Upload, X, File, Download } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

interface ArticleAttachmentsSectionProps {
  form: UseFormReturn<any>;
  attachments: AttachmentFile[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentFile[]>>;
}

const ArticleAttachmentsSection: React.FC<ArticleAttachmentsSectionProps> = ({ 
  attachments, 
  setAttachments 
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      
      setAttachments((prev) => [...prev, ...newFiles]);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Article Attachments</h2>
          <CollapsibleTrigger asChild>
            <button className="p-2 rounded-md hover:bg-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent 
          className="px-6 pb-6"
          forceMount
        >
          <div className={`${isOpen ? 'block' : 'hidden'} space-y-4 pt-4`}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            />
            
            <Button 
              onClick={triggerFileInput}
              variant="outline"
              className="w-full border-dashed border-2 p-8 flex flex-col items-center justify-center gap-2 hover:bg-muted/50"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Click to upload files</p>
                <p className="text-sm text-muted-foreground">PDF, Word, Excel, PowerPoint, Text files</p>
              </div>
            </Button>
            
            {attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium">Uploaded Files</h3>
                <div className="rounded-md border divide-y">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {attachment.url && (
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 hover:bg-muted rounded-md"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="p-1.5 hover:bg-muted rounded-md text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ArticleAttachmentsSection;
