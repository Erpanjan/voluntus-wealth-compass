
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

// Types for our article operations
export interface Author {
  id: string;
  name: string;
  image_url?: string;
  bio?: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: any;
  category: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors?: Author[];
  reports?: Report[];
}

// Functions to work with articles
export const articleService = {
  // Get all articles with their authors
  async getArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.rpc('get_articles_with_authors');
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        ...item,
        authors: Array.isArray(item.authors) 
          ? item.authors.map((author: any) => ({
              id: author.id,
              name: author.name,
              image_url: author.image_url
            })) 
          : []
      })) || [];
      
      return processedData;
    } catch (error) {
      console.error('Error in getArticles:', error);
      return [];
    }
  },

  // Get published articles for public consumption
  async getPublishedArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.rpc('get_articles_with_authors');
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        ...item,
        authors: Array.isArray(item.authors) 
          ? item.authors.map((author: any) => ({
              id: author.id,
              name: author.name,
              image_url: author.image_url
            })) 
          : []
      })) || [];
      
      // Filter to only return published articles (where published_at is in the past)
      const now = new Date();
      return processedData.filter((article: Article) => {
        return new Date(article.published_at) <= now;
      });
    } catch (error) {
      console.error('Error in getPublishedArticles:', error);
      return [];
    }
  },

  // Get a single article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase.rpc('get_article_by_slug', {
        slug_param: slug
      });
      
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Process the data to ensure correct typing
        const article: Article = {
          ...data[0],
          authors: Array.isArray(data[0].authors) 
            ? data[0].authors.map((author: any) => ({
                id: author.id,
                name: author.name,
                image_url: author.image_url
              })) 
            : [],
          reports: Array.isArray(data[0].reports) 
            ? data[0].reports.map((report: any) => ({
                id: report.id,
                title: report.title,
                description: report.description,
                file_url: report.file_url,
                created_at: report.created_at
              })) 
            : []
        };
        return article;
      }
      
      return null;
    } catch (error) {
      console.error('Error in getArticleBySlug:', error);
      return null;
    }
  },

  // Get all available authors
  async getAuthors(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching authors:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return [];
    }
  },

  // Create or update an article
  async saveArticle(article: Partial<Article>, authorIds: string[], imageFile?: File | null, attachments?: any[]): Promise<string | null> {
    try {
      const isUpdate = !!article.id;
      let articleId = article.id || uuidv4();
      
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
      }
      
      // 2. Create or update the article
      const articleData = {
        title: article.title,
        description: article.description,
        content: article.content || {},
        category: article.category,
        image_url: imageUrl,
        published_at: article.published_at,
        updated_at: new Date().toISOString(),
      };
      
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
        
        return updatedArticle?.slug || '';
      } else {
        // Create new article with auto-generated slug
        const slugifiedTitle = article.title 
          ? article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
          : uuidv4();
        
        const { data: newArticle, error: insertError } = await supabase
          .from('articles')
          .insert({
            id: articleId,
            ...articleData,
            slug: slugifiedTitle
          })
          .select('slug')
          .single();
        
        if (insertError) {
          console.error('Error creating article:', insertError);
          throw insertError;
        }
        
        return newArticle?.slug || '';
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
        for (const attachment of attachments) {
          // Skip if it's an existing attachment (no file) that we don't need to update
          if (!attachment.file && attachment.id) continue;
          
          // Handle file upload if there's a file
          let fileUrl = attachment.file_url;
          if (attachment.file) {
            const filePath = `articles/${articleId}/attachments/${uuidv4()}-${attachment.file.name}`;
            const { error: fileError } = await supabase.storage
              .from('article-assets')
              .upload(filePath, attachment.file, {
                upsert: true,
                contentType: attachment.file.type,
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
          if (attachment.id && attachment.id.startsWith('attachment-')) {
            // This is a new attachment that was just created in the UI
            // It has a temporary ID that starts with 'attachment-'
            const { error: reportError } = await supabase
              .from('reports')
              .insert({
                article_id: articleId,
                title: attachment.title,
                description: attachment.description,
                file_url: fileUrl || ''
              });
            
            if (reportError) {
              console.error('Error creating report:', reportError);
              throw reportError;
            }
          } else if (attachment.id) {
            // Update existing report
            const { error: reportError } = await supabase
              .from('reports')
              .update({
                title: attachment.title,
                description: attachment.description,
                file_url: fileUrl
              })
              .eq('id', attachment.id);
            
            if (reportError) {
              console.error('Error updating report:', reportError);
              throw reportError;
            }
          } else {
            // Create new report
            const { error: reportError } = await supabase
              .from('reports')
              .insert({
                article_id: articleId,
                title: attachment.title,
                description: attachment.description,
                file_url: fileUrl || ''
              });
            
            if (reportError) {
              console.error('Error creating report:', reportError);
              throw reportError;
            }
          }
        }
      }
      
      return articleId;
    } catch (error) {
      console.error('Error in saveArticle:', error);
      return null;
    }
  },

  // Delete an article
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

  // Toggle article publish status
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
