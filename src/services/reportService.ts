
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

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
      console.log("Saving report for article:", articleId);
      console.log("Report data:", report);
      console.log("File:", file ? `${file.name} (${file.size} bytes, ${file.type})` : "No file provided");
      
      // Handle file upload if there's a file
      let fileUrl = report.file_url;
      if (file) {
        const filePath = `articles/${articleId}/attachments/${uuidv4()}-${file.name}`;
        console.log("Uploading file to path:", filePath);
        
        // Upload the file to Supabase storage
        const { data: uploadData, error: fileError } = await supabase.storage
          .from('article-assets')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });
        
        if (fileError) {
          console.error('Error uploading attachment:', fileError);
          throw fileError;
        }
        
        console.log("File uploaded successfully:", uploadData);
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('article-assets')
          .getPublicUrl(filePath);
        
        console.log("Generated public URL:", publicUrl);
        fileUrl = publicUrl;
      }
      
      // Create or update the report
      if (report.id && report.id.startsWith('attachment-')) {
        console.log("Creating new report from temporary attachment");
        // This is a new attachment that was just created in the UI
        const { data, error: reportError } = await supabase
          .from('reports')
          .insert({
            article_id: articleId,
            title: report.title || file?.name || 'Unnamed attachment',
            description: report.description || '',
            file_url: fileUrl || ''
          })
          .select();
        
        if (reportError) {
          console.error('Error creating report:', reportError);
          throw reportError;
        }
        
        console.log("Created new report in database:", data);
        return true;
      } else if (report.id) {
        console.log("Updating existing report");
        // Update existing report
        const { data, error: reportError } = await supabase
          .from('reports')
          .update({
            title: report.title || file?.name || 'Unnamed attachment',
            description: report.description || '',
            file_url: fileUrl || report.file_url || '' // Keep existing URL if no new file
          })
          .eq('id', report.id)
          .select();
        
        if (reportError) {
          console.error('Error updating report:', reportError);
          throw reportError;
        }
        
        console.log("Updated report in database:", data);
        return true;
      } else if (fileUrl) {
        console.log("Creating new report with file URL");
        // Create new report
        const { data, error: reportError } = await supabase
          .from('reports')
          .insert({
            article_id: articleId,
            title: report.title || file?.name || 'Unnamed attachment',
            description: report.description || '',
            file_url: fileUrl
          })
          .select();
        
        if (reportError) {
          console.error('Error creating report:', reportError);
          throw reportError;
        }
        
        console.log("Created new report in database:", data);
        return true;
      } else {
        console.warn("No file URL available, skipping report creation");
        return false;
      }
    } catch (error) {
      console.error('Error in saveReport:', error);
      return false;
    }
  },

  /**
   * Check if the article-assets storage bucket exists, create if not
   */
  async ensureStorageBucketExists(): Promise<boolean> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }
      
      const bucketExists = buckets.some(b => b.name === 'article-assets');
      
      if (!bucketExists) {
        console.log('Creating article-assets bucket');
        const { error: createError } = await supabase.storage.createBucket('article-assets', {
          public: true
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }
        
        console.log('Bucket created successfully');
      } else {
        console.log('article-assets bucket already exists');
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureStorageBucketExists:', error);
      return false;
    }
  }
};
