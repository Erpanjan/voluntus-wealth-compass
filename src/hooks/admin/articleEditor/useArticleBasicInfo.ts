
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Sample data for edit mode - would normally come from the database
const SAMPLE_ARTICLE = {
  id: '1',
  title: 'Understanding Financial Planning',
  slug: 'understanding-financial-planning',
  description: 'An overview of financial planning principles',
  content: 'This is the content of the article. It would normally be much longer.',
  category: 'Finance',
  image_url: 'https://example.com/image.jpg',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

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
    if (!isEditMode) return;
    
    try {
      // This would normally fetch from the articles table
      // For now, use sample data
      const data = SAMPLE_ARTICLE;
      
      if (data) {
        form.reset({
          title: data.title,
          description: data.description,
          category: data.category,
          content: data.content as string,
          image_url: data.image_url,
          published_at: format(new Date(data.published_at), 'yyyy-MM-dd'),
        });
      }
      
      return data;
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
