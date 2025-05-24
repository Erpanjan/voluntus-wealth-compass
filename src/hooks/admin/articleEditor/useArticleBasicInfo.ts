
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
      author_name: '',
      image_url: '',
      published_at: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  // Load article data if in edit mode
  const loadArticleData = async () => {
    if (!isEditMode || !id) return null;
    
    try {
      console.log('Loading article data for ID:', id);
      const article = await articleService.getArticleById(id);
      
      if (article) {
        console.log('Article loaded successfully:', article);
        
        // Process content to handle different formats
        let processedContent = '';
        if (typeof article.content === 'string') {
          processedContent = article.content;
        } else if (article.content && typeof article.content === 'object') {
          if (article.content.html) {
            processedContent = article.content.html;
          } else {
            processedContent = JSON.stringify(article.content);
          }
        } else {
          processedContent = article.content || '';
        }
        
        form.reset({
          title: article.title || '',
          description: article.description || '',
          category: article.category || '',
          content: processedContent,
          author_name: article.author_name || '',
          image_url: article.image_url || '',
          published_at: format(new Date(article.published_at), 'yyyy-MM-dd'),
        });
        
        return article;
      } else {
        console.error('Article not found with ID:', id);
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
        description: 'Failed to fetch article data. Please try again.',
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
