
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getFileExtension, getMimeTypeFromExtension } from '@/components/admin/articles/attachments/utils';

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
        console.error('Error loading attachments:', error);
        throw error;
      }
      
      console.log("Reports data from database:", data);
      
      if (data && data.length > 0) {
        const formattedAttachments = data.map(item => {
          // Get file name from the URL
          const urlParts = item.file_url?.split('/') || [];
          const fileName = urlParts[urlParts.length - 1]?.split('-').slice(1).join('-') || item.title;
          
          // Extract file extension from file_url
          const fileExtension = getFileExtension(item.file_url || '');
          const mimeType = getMimeTypeFromExtension(fileExtension);
          
          // Estimate file size if not provided (default to 100KB)
          const estimatedSize = 102400; // 100KB in bytes
          
          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            file_url: item.file_url,
            created_at: item.created_at,
            name: fileName || item.title, // Use extracted filename or fall back to title
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
  
  return {
    attachments,
    setAttachments,
    loadAttachmentsData,
    isLoading
  };
};
