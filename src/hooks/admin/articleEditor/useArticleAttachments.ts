
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Attachment {
  id?: string;
  title: string;
  description?: string;
  file_url?: string;
  file?: File;
  created_at?: string;
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
        const formattedAttachments = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          file_url: item.file_url,
          created_at: item.created_at,
        }));
        
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
