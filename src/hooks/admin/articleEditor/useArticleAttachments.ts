
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Attachment {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  file?: File;
  created_at?: string;
  name: string; // Required property
  size: number; // Required property
  type: string; // Required property
  url?: string;
}

export const useArticleAttachments = (isEditMode: boolean) => {
  const { id } = useParams();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const loadAttachmentsData = async () => {
    if (!isEditMode || !id) return;
    
    try {
      setIsLoading(true);
      console.log("Loading attachments for article:", id);
      
      // Fetch reports for the article
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('article_id', id);
      
      if (error) {
        throw error;
      }
      
      console.log("Reports data from database:", data);
      
      if (data && data.length > 0) {
        const formattedAttachments = data.map(item => {
          // Extract file extension from file_url
          const fileExtension = item.file_url?.split('.').pop() || 'unknown';
          const mimeType = getMimeTypeFromExtension(fileExtension);
          
          // Estimate file size if not provided (default to 100KB)
          const estimatedSize = 102400; // 100KB in bytes
          
          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            file_url: item.file_url,
            created_at: item.created_at,
            name: item.title, // Set name to title
            size: estimatedSize, // Since there's no size in the reports table, we use an estimated size
            type: mimeType, // Set type based on file extension
            url: item.file_url
          };
        });
        
        console.log("Formatted attachments:", formattedAttachments);
        setAttachments(formattedAttachments);
      } else {
        console.log("No attachments found for article:", id);
      }
    } catch (error) {
      console.error('Error loading attachments:', error);
      toast({
        title: "Error",
        description: 'Failed to load article attachments.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load attachments when in edit mode and ID changes
  useEffect(() => {
    if (isEditMode && id) {
      loadAttachmentsData();
    }
  }, [isEditMode, id]);
  
  // Helper function to determine MIME type from file extension
  const getMimeTypeFromExtension = (extension: string): string => {
    const extensionMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'txt': 'text/plain',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif'
    };
    
    return extensionMap[extension.toLowerCase()] || 'application/octet-stream';
  };
  
  return {
    attachments,
    setAttachments,
    loadAttachmentsData,
    isLoading
  };
};
