
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ArticleInput } from '@/types/article.types';
import { createUniqueSlug } from '@/utils/articleUtils';
import { reportService } from '../reportService';

/**
 * Handles all mutation operations for articles
 */
export const articleMutationService = {
  /**
   * Create or update an article
   * @param article The article data to save
   * @param authorIds IDs of authors to associate with this article
   * @param imageFile Optional image file to upload
   * @param attachments Optional attachments/reports to include
   * @returns The slug of the saved article or null on failure
   */
  async saveArticle(
    article: ArticleInput, 
    authorIds: string[], 
    imageFile?: File | null, 
    attachments?: any[]
  ): Promise<string | null> {
    try {
      const isUpdate = !!article.id;
      let articleId = article.id || uuidv4();
      
      console.log(`${isUpdate ? 'Updating' : 'Creating'} article with ID: ${articleId}`);
      console.log("Authors:", authorIds);
      console.log("Attachments:", attachments?.length || 0);
      
      // Ensure the storage bucket exists
      await reportService.ensureStorageBucketExists();
      
      // 1. Upload image if provided
      let imageUrl = article.image_url;
      if (imageFile) {
        const imagePath = `articles/${articleId}/${uuidv4()}`;
        console.log("Uploading image to path:", imagePath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('article-assets')
          .upload(imagePath, imageFile, {
            upsert: true,
            contentType: imageFile.type,
          });
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw uploadError;
        }
        
        // Get public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('article-assets')
          .getPublicUrl(imagePath);
        
        imageUrl = publicUrl;
        console.log("Uploaded image URL:", imageUrl);
      }
      
      // 2. Create or update the article
      const articleData = {
        title: article.title,
        description: article.description || '',
        content: article.content || {},
        category: article.category || 'Uncategorized',
        image_url: imageUrl,
        published_at: article.published_at,
        updated_at: new Date().toISOString(),
      };
      
      let slug: string | null = null;
      
      if (isUpdate) {
        // Update existing article
        const { data: updatedArticle, error: updateError } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId)
          .select('slug')
          .single();
        
        if (updateError) {
          console.error('Error updating article:', updateError);
          throw updateError;
        }
        
        slug = updatedArticle?.slug || null;
      } else {
        // Create new article with unique slug
        const uniqueSlug = createUniqueSlug(article.title || 'untitled');
        
        const { data: newArticle, error: insertError } = await supabase
          .from('articles')
          .insert({
            id: articleId,
            ...articleData,
            slug: uniqueSlug
          })
          .select('slug')
          .single();
        
        if (insertError) {
          console.error('Error creating article:', insertError);
          throw insertError;
        }
        
        slug = newArticle?.slug || null;
      }
      
      // 3. Handle article-author relationships
      if (isUpdate) {
        // Remove existing associations
        const { error: deleteError } = await supabase
          .from('article_authors')
          .delete()
          .eq('article_id', articleId);
        
        if (deleteError) {
          console.error('Error removing author associations:', deleteError);
          throw deleteError;
        }
      }
      
      // Add new author associations
      if (authorIds && authorIds.length > 0) {
        const authorAssociations = authorIds.map(authorId => ({
          article_id: articleId,
          author_id: authorId
        }));
        
        const { error: authorError } = await supabase
          .from('article_authors')
          .insert(authorAssociations);
        
        if (authorError) {
          console.error('Error adding author associations:', authorError);
          throw authorError;
        }
      }
      
      // 4. Handle attachments/reports
      if (attachments && attachments.length > 0) {
        console.log("Processing attachments:", attachments.length);
        
        for (const attachment of attachments) {
          console.log("Processing attachment:", attachment.id, attachment.title);
          try {
            await reportService.saveReport(articleId, attachment, attachment.file);
          } catch (error) {
            console.error('Error processing attachment:', error);
            // Continue with other attachments
          }
        }
        
        // Check if reports were created
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .eq('article_id', articleId);
          
        if (reportsError) {
          console.error('Error checking reports:', reportsError);
        } else {
          console.log(`Article has ${reports?.length || 0} reports in database after processing`);
        }
      }
      
      return articleId;
    } catch (error) {
      console.error('Error in saveArticle:', error);
      throw error; // Rethrow to allow proper error handling
    }
  },

  /**
   * Delete an article
   * @param id The ID of the article to delete
   * @returns Success status
   */
  async deleteArticle(id: string): Promise<boolean> {
    try {
      // Delete article (cascade will delete article_authors and reports)
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting article:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteArticle:', error);
      return false;
    }
  },

  /**
   * Toggle article publish status
   * @param id The ID of the article to update
   * @param isPublished Whether the article should be published
   * @returns Success status
   */
  async togglePublishStatus(id: string, isPublished: boolean): Promise<boolean> {
    try {
      const publishedAt = isPublished 
        ? new Date().toISOString() 
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days in the future
      
      const { error } = await supabase
        .from('articles')
        .update({ published_at: publishedAt })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating publish status:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in togglePublishStatus:', error);
      return false;
    }
  }
};
