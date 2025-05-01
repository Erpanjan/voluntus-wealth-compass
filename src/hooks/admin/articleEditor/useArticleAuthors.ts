
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/articleService';
import { Author } from '@/types/article.types';

export const useArticleAuthors = (isEditMode: boolean) => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
  
  // Load authors for the current article
  const loadAuthorsData = async () => {
    try {
      // 1. Fetch all available authors
      const authors = await articleService.getAuthors();
      setAvailableAuthors(authors);
      
      // 2. If in edit mode, find the article and get its authors
      if (isEditMode && id) {
        const articles = await articleService.getArticles();
        const article = articles.find(a => a.id === id);
        
        if (article && article.authors && article.authors.length > 0) {
          // Extract author IDs from the article
          const authorIds = article.authors.map(author => author.id);
          setSelectedAuthors(authorIds);
        }
      }
    } catch (error) {
      console.error('Error loading authors data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load authors data.',
        variant: 'destructive',
      });
    }
  };
  
  return {
    selectedAuthors,
    setSelectedAuthors,
    availableAuthors,
    loadAuthorsData
  };
};
