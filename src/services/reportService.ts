
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const reportService = {
  /**
   * Add or update a report for an article
   * @param articleId The article ID
   * @param report The report data
   * @param file Optional file to upload
   * @returns Success status
   */
  async saveReport(articleId: string, report: any, file?: File): Promise<boolean> {
    try {
      // Handle file upload if there's a file
      let fileUrl = report.file_url;
      if (file) {
        const filePath = `articles/${articleId}/attachments/${uuidv4()}-${file.name}`;
        const { error: fileError } = await supabase.storage
          .from('article-assets')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });
        
        if (fileError) {
          console.error('Error uploading attachment:', fileError);
          throw fileError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('article-assets')
          .getPublicUrl(filePath);
        
        fileUrl = publicUrl;
      }
      
      // Create or update the report
      if (report.id && report.id.startsWith('attachment-')) {
        // This is a new attachment that was just created in the UI
        const { error: reportError } = await supabase
          .from('reports')
          .insert({
            article_id: articleId,
            title: report.title || 'Unnamed attachment',
            description: report.description || '',
            file_url: fileUrl || ''
          });
        
        if (reportError) {
          console.error('Error creating report:', reportError);
          throw reportError;
        }
      } else if (report.id) {
        // Update existing report
        const { error: reportError } = await supabase
          .from('reports')
          .update({
            title: report.title || 'Unnamed attachment',
            description: report.description || '',
            file_url: fileUrl || ''
          })
          .eq('id', report.id);
        
        if (reportError) {
          console.error('Error updating report:', reportError);
          throw reportError;
        }
      } else if (fileUrl) {
        // Create new report
        const { error: reportError } = await supabase
          .from('reports')
          .insert({
            article_id: articleId,
            title: report.title || 'Unnamed attachment',
            description: report.description || '',
            file_url: fileUrl
          });
        
        if (reportError) {
          console.error('Error creating report:', reportError);
          throw reportError;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveReport:', error);
      return false;
    }
  }
};
