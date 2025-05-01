import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Upload, X, File, Download } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Attachment } from '@/hooks/admin/articleEditor/useArticleAttachments';

interface ArticleAttachmentsSectionProps {
  form: UseFormReturn<any>;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
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
        title: file.name,
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
    <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Article Attachments</h2>
          <CollapsibleTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-200 transition-colors">
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
                className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent 
          className="bg-white"
          forceMount
        >
          <div className={`${isOpen ? 'block' : 'hidden'} p-6 space-y-6`}>
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
              className="w-full border-dashed border-2 p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <div className="text-center">
                <p className="font-medium text-gray-700">Click to upload files</p>
                <p className="text-sm text-gray-500 mt-1">PDF, Word, Excel, PowerPoint, Text files</p>
              </div>
            </Button>
            
            {attachments.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
                <div className="rounded-md border divide-y">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <File className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{attachment.name || attachment.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {attachment.size ? formatFileSize(attachment.size) : 'Unknown size'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {(attachment.file_url || attachment.url) && (
                          <a 
                            href={attachment.file_url || attachment.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Download className="h-4 w-4 text-gray-600" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="p-2 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 transition-colors"
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
