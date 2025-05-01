
import { useState } from 'react';
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
  const { toast } = useToast();
  
  const loadAttachmentsData = async () => {
    if (!isEditMode || !id) return;
    
    try {
      // Fetch reports for the article
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('article_id', id);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedAttachments = data.map(item => {
          // Extract file extension from file_url
          const fileExtension = item.file_url?.split('.').pop() || 'unknown';
          
          // Estimate file size if not provided (default to 100KB)
          const estimatedSize = 102400; // 100KB in bytes
          
          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            file_url: item.file_url,
            created_at: item.created_at,
            name: item.title, // Set name to title
            size: item.size || estimatedSize, // Use estimated size if not available
            type: fileExtension, // Set type based on file extension
            url: item.file_url
          };
        });
        
        setAttachments(formattedAttachments);
      }
    } catch (error) {
      console.error('Error loading attachments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article attachments.',
        variant: 'destructive',
      });
    }
  };
  
  return {
    attachments,
    setAttachments,
    loadAttachmentsData
  };
};
