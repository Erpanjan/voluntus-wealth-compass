import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { createUniqueSlug } from '@/utils/articleUtils';

interface MultilingualArticleInput {
  id?: string;
  en: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  zh: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  image_url?: string;
  published_at: string;
}

/**
 * Handles all mutation operations for multilingual articles
 */
export const articleMutationService = {
  /**
   * Create or update a multilingual article
   * @param article The multilingual article data to save
   * @param authorIds Not used anymore - kept for compatibility
   * @param imageFile Optional image file to upload
   * @param attachments Not used anymore - kept for compatibility
   * @returns The slug of the saved article or null on failure
   */
  async saveMultilingualArticle(
    article: MultilingualArticleInput, 
    authorIds: string[] = [], 
    imageFile?: File | null, 
    attachments?: any[]
  ): Promise<string | null> {
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Authentication required:', authError);
        throw new Error('You must be logged in to save articles');
      }

      const isUpdate = !!article.id;
      let articleId = article.id || uuidv4();
      
      console.log(`${isUpdate ? 'Updating' : 'Creating'} multilingual article with ID: ${articleId}`);
      console.log('Article data being saved:', {
        en: article.en,
        zh: article.zh,
        user: user.id
      });
      
      // 1. Upload image if provided
      let imageUrl = article.image_url;
      if (imageFile) {
        const imagePath = `articles/${articleId}/${uuidv4()}`;
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
      
      // 2. Determine the primary title and ensure required fields are populated
      const primaryTitle = article.en.title?.trim() || article.zh.title?.trim() || 'Untitled Article';
      const primaryDescription = article.en.description?.trim() || article.zh.description?.trim() || '';
      const primaryCategory = article.en.category?.trim() || article.zh.category?.trim() || '';
      const primaryAuthor = article.en.author_name?.trim() || article.zh.author_name?.trim() || '';
      const primaryContent = article.en.content || article.zh.content || {};
      
      // 3. Create or update the multilingual article
      const articleData = {
        title_en: article.en.title?.trim() || '',
        title_zh: article.zh.title?.trim() || '',
        description_en: article.en.description?.trim() || '',
        description_zh: article.zh.description?.trim() || '',
        content_en: article.en.content || {},
        content_zh: article.zh.content || {},
        category_en: article.en.category?.trim() || '',
        category_zh: article.zh.category?.trim() || '',
        author_name_en: article.en.author_name?.trim() || '',
        author_name_zh: article.zh.author_name?.trim() || '',
        // Keep legacy columns for backward compatibility (use primary values)
        title: primaryTitle,
        description: primaryDescription,
        content: primaryContent,
        category: primaryCategory,
        author_name: primaryAuthor,
        image_url: imageUrl,
        published_at: article.published_at,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Final article data for database:', articleData);
      
      let slug: string | null = null;
      
      if (isUpdate) {
        // Update existing article
        const { data: updatedArticle, error: updateError } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId)
          .select('id')
          .single();
        
        if (updateError) {
          console.error('Error updating multilingual article:', updateError);
          throw updateError;
        }
        
        slug = articleId;
      } else {
        // Create new article with unique slug
        const uniqueSlug = createUniqueSlug(primaryTitle);
        
        const { data: newArticle, error: insertError } = await supabase
          .from('articles')
          .insert({
            id: articleId,
            ...articleData,
            slug: uniqueSlug
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error('Error creating multilingual article:', insertError);
          console.error('Insert error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw insertError;
        }
        
        slug = articleId;
      }
      
      return slug;
    } catch (error) {
      console.error('Error in saveMultilingualArticle:', error);
      throw error;
    }
  },

  /**
   * Create or update an article
   * @param article The article data to save
   * @param authorIds Not used anymore - kept for compatibility
   * @param imageFile Optional image file to upload
   * @param attachments Not used anymore - kept for compatibility
   * @returns The slug of the saved article or null on failure
   */
  async saveArticle(
    article: any, 
    authorIds: string[] = [], 
    imageFile?: File | null, 
    attachments?: any[]
  ): Promise<string | null> {
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Authentication required:', authError);
        throw new Error('You must be logged in to save articles');
      }

      const isUpdate = !!article.id;
      let articleId = article.id || uuidv4();
      
      console.log(`${isUpdate ? 'Updating' : 'Creating'} article with ID: ${articleId}`);
      
      // 1. Upload image if provided
      let imageUrl = article.image_url;
      if (imageFile) {
        const imagePath = `articles/${articleId}/${uuidv4()}`;
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
        category: article.category || '',
        author_name: article.author_name || '',
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
          .select('id')
          .single();
        
        if (updateError) {
          console.error('Error updating article:', updateError);
          throw updateError;
        }
        
        slug = articleId;
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
          .select('id')
          .single();
        
        if (insertError) {
          console.error('Error creating article:', insertError);
          throw insertError;
        }
        
        slug = articleId;
      }
      
      return slug;
    } catch (error) {
      console.error('Error in saveArticle:', error);
      throw error;
    }
  },

  /**
   * Delete an article
   * @param id The ID of the article to delete
   * @returns Success status
   */
  async deleteArticle(id: string): Promise<boolean> {
    try {
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
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
      
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
