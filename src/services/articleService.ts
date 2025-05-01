
import { ArticleData, supabase } from '@/types/supabase';
import { ArticleFormValues } from '@/hooks/useArticleForm';
import { createOrUpdateAuthorAssociation } from './authorService';

export const fetchArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as ArticleData;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

export const saveArticle = async (
  formData: ArticleFormValues, 
  htmlContent: string,
  imageUrl: string,
  isPublish: boolean,
  id?: string
): Promise<string | null> => {
  try {
    // Prepare article data
    const articleData: ArticleData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      content: [{ type: 'html', content: htmlContent }],
      image_url: imageUrl,
      published_at: isPublish 
        ? new Date().toISOString() 
        : new Date(formData.published_at).toISOString(),
      slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    };
    
    let articleId = id;
    
    if (id) {
      // Update existing article
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id);
        
      if (error) throw error;
    } else {
      // Create new article
      const { data: newArticle, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select();
        
      if (error) throw error;
      
      if (newArticle && newArticle.length > 0) {
        articleId = newArticle[0].id;
      }
    }
    
    // Handle author if provided
    if (articleId && formData.author) {
      await createOrUpdateAuthorAssociation(articleId, formData.author);
    }
    
    return articleId || null;
  } catch (error) {
    console.error('Error saving article:', error);
    return null;
  }
};

export const extractContentHtml = (content: any): string => {
  let contentHtml = '';
  
  if (content) {
    if (Array.isArray(content)) {
      const contentItem = content[0] as any;
      contentHtml = contentItem && contentItem.content ? contentItem.content : '';
    } else if (typeof content === 'object' && content !== null) {
      // Handle if content is an object
      contentHtml = (content as any).content || '';
    } else {
      contentHtml = '';
    }
  }
  
  return contentHtml;
};
