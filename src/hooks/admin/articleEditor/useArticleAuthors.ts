
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';
import { authorService } from '@/services/authorService';
import { Author } from '@/types/multilingual-article.types';

export const useArticleAuthors = (isEditMode: boolean) => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
  const [localAuthors, setLocalAuthors] = useState<{[key: string]: string}>({});
  
  // Load authors for the current article
  const loadAuthorsData = async () => {
    try {
      // 1. Fetch all available authors
      const authors = await authorService.getAuthors();
      setAvailableAuthors(authors);
      
      // 2. If in edit mode, find the article and get its authors
      if (isEditMode && id) {
        const articlesResponse = await articleService.getMultilingualArticles();
        const article = articlesResponse.articles.find(a => a.id === id); // Fixed: access articles array
        
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

  // Process authors before saving article
  const processAuthorsForSave = async (): Promise<string[]> => {
    const finalAuthorIds: string[] = [];
    
    // Handle each selected author
    for (const authorId of selectedAuthors) {
      // If it's a temporary author, create it in the database
      if (authorId.startsWith('new_') && localAuthors[authorId]) {
        try {
          // Create the author in the database
          const newAuthorData = {
            name: localAuthors[authorId],
            bio: '' // Optional default bio
          };
          
          const createdAuthor = await authorService.createAuthor(newAuthorData);
          if (createdAuthor && createdAuthor.id) {
            finalAuthorIds.push(createdAuthor.id);
          } else {
            toast({
              title: 'Warning',
              description: `Could not create author: ${localAuthors[authorId]}`,
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error creating author:', error);
          toast({
            title: 'Error',
            description: `Failed to create author: ${localAuthors[authorId]}`,
            variant: 'destructive',
          });
        }
      } else {
        // It's an existing author ID
        finalAuthorIds.push(authorId);
      }
    }
    
    return finalAuthorIds;
  };
  
  return {
    selectedAuthors,
    setSelectedAuthors,
    availableAuthors,
    loadAuthorsData,
    processAuthorsForSave,
    localAuthors,
    setLocalAuthors
  };
};
