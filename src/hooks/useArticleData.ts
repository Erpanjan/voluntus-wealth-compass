
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArticleData, AuthorData } from '@/types/supabase';
import { supabase } from '@/types/supabase';
import { format } from 'date-fns';
import { ArticleFormValues } from './useArticleForm';

export const useArticleData = (id?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [article, setArticle] = useState<ArticleData | null>(null);
  
  const isEditMode = !!id;
  
  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('articles') as any)
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setArticle(data as ArticleData);
        
        // Convert content to HTML if it exists
        let contentHtml = '';
        if (data.content) {
          if (Array.isArray(data.content)) {
            const contentItem = data.content[0] as any;
            contentHtml = contentItem && contentItem.content ? contentItem.content : '';
          } else if (typeof data.content === 'object' && data.content !== null) {
            // Handle if content is an object
            contentHtml = (data.content as any).content || '';
          } else {
            contentHtml = data.description || '';
          }
        }
        
        const formData = {
          title: data.title,
          description: data.description,
          category: data.category || '',
          author: '', // Will be populated below
          image_url: data.image_url || '',
          published_at: format(new Date(data.published_at), 'yyyy-MM-dd'),
        };
        
        // Fetch article author
        if (id) {
          const { data: authorJoins, error: authorError } = await (supabase
            .from('article_authors') as any)
            .select('author_id')
            .eq('article_id', id);
            
          if (!authorError && authorJoins && authorJoins.length > 0) {
            const authorId = authorJoins[0].author_id;
            const { data: authorData } = await (supabase
              .from('authors') as any)
              .select('name')
              .eq('id', authorId)
              .single();
              
            if (authorData) {
              formData.author = authorData.name;
            }
          }
        }
        
        return { 
          article: data as ArticleData, 
          formData, 
          contentHtml 
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article data',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const handleAuthor = async (articleId: string, authorName: string): Promise<string | null> => {
    try {
      // Check if author exists
      const { data: existingAuthor } = await (supabase
        .from('authors') as any)
        .select('id')
        .eq('name', authorName)
        .single();
        
      let authorId;
      
      if (!existingAuthor) {
        // Create new author
        const { data: newAuthor, error: authorError } = await (supabase
          .from('authors') as any)
          .insert({
            name: authorName,
          })
          .select();
          
        if (authorError) throw authorError;
        
        if (newAuthor && newAuthor.length > 0) {
          authorId = newAuthor[0].id;
        }
      } else {
        authorId = existingAuthor.id;
      }
      
      // Delete existing author association
      if (isEditMode) {
        await (supabase
          .from('article_authors') as any)
          .delete()
          .eq('article_id', articleId);
      }
      
      // Create author association
      if (authorId) {
        const { error: joinError } = await (supabase
          .from('article_authors') as any)
          .insert({
            article_id: articleId,
            author_id: authorId
          });
          
        if (joinError) throw joinError;
        return authorId;
      }
      
      return null;
    } catch (error) {
      console.error('Error handling author:', error);
      return null;
    }
  };
  
  const saveArticle = async (
    formData: ArticleFormValues, 
    htmlContent: string,
    imageUrl: string,
    publish: boolean
  ): Promise<boolean> => {
    setSubmitting(true);
    
    try {
      // Prepare article data
      const articleData: ArticleData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        content: [{ type: 'html', content: htmlContent }],
        image_url: imageUrl,
        published_at: publish 
          ? new Date().toISOString() 
          : new Date(formData.published_at).toISOString(),
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      };
      
      let articleId = id;
      
      if (isEditMode && id) {
        // Update existing article
        const { error } = await (supabase
          .from('articles') as any)
          .update(articleData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new article
        const { data: newArticle, error } = await (supabase
          .from('articles') as any)
          .insert(articleData)
          .select();
          
        if (error) throw error;
        
        if (newArticle && newArticle.length > 0) {
          articleId = newArticle[0].id;
        }
      }
      
      // Handle author
      if (articleId && formData.author) {
        await handleAuthor(articleId, formData.author);
      }
      
      toast({
        title: 'Success',
        description: publish 
          ? 'Article published successfully' 
          : (isEditMode ? 'Article updated successfully' : 'Article saved as draft'),
      });
      
      return true;
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    article,
    isEditMode,
    fetchArticle,
    saveArticle
  };
};
