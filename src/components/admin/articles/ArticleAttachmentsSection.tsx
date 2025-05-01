
import React from 'react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { UseFormReturn } from 'react-hook-form';
import { Attachment } from '@/hooks/admin/articleEditor/useArticleAttachments';
import { useToast } from '@/hooks/use-toast';
import { AttachmentList, FileUploadArea, validateFile } from './attachments';

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
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        // Validate file size
        if (!validateFile(file)) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 10MB size limit.`,
            variant: "destructive",
          });
          return null;
        }
        
        return {
          id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          title: file.name,
          size: file.size,
          type: file.type,
          file: file
        };
      }).filter(Boolean) as Attachment[];
      
      if (newFiles.length > 0) {
        console.log("Adding new attachments:", newFiles);
        setAttachments((prev) => [...prev, ...newFiles]);
        
        // Show success toast
        if (newFiles.length === 1) {
          toast({
            title: "File added",
            description: `${newFiles[0].name} has been added to attachments.`
          });
        } else {
          toast({
            title: "Files added",
            description: `${newFiles.length} files have been added to attachments.`
          });
        }
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemoveAttachment = (id: string) => {
    const attachmentToRemove = attachments.find(att => att.id === id);
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    
    if (attachmentToRemove) {
      toast({
        title: "Attachment removed",
        description: `${attachmentToRemove.name || attachmentToRemove.title} has been removed.`
      });
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            
            <FileUploadArea triggerFileInput={triggerFileInput} />
            
            <AttachmentList 
              attachments={attachments} 
              onRemoveAttachment={handleRemoveAttachment} 
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ArticleAttachmentsSection;
