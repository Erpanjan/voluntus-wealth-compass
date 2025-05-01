
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/articleService';

export const useArticleBasicInfo = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      content: '',
      image_url: '',
      published_at: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  // Load article data if in edit mode
  const loadArticleData = async () => {
    if (!isEditMode || !id) return null;
    
    try {
      // Fetch articles and find the one with matching ID
      const articles = await articleService.getArticles();
      const article = articles.find(a => a.id === id);
      
      if (article) {
        form.reset({
          title: article.title,
          description: article.description,
          category: article.category,
          content: article.content,
          image_url: article.image_url || '',
          published_at: format(new Date(article.published_at), 'yyyy-MM-dd'),
        });
        
        return article;
      } else {
        toast({
          title: 'Article Not Found',
          description: 'Could not find the article you are trying to edit.',
          variant: 'destructive',
        });
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch article data.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    form,
    isEditMode,
    loadArticleData
  };
};
