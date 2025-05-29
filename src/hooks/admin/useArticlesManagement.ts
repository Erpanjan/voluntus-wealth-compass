
import { useState } from 'react';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { articleService } from '@/services/article';
import { Article } from '@/services/article/types';

export const useArticlesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { data: articles, isLoading, error, refetch } = useOptimizedQuery<Article[]>({
    queryKey: ['admin-articles', currentPage, pageSize],
    queryFn: () => articleService.getArticles(currentPage, pageSize),
    priority: 'high',
    cacheStrategy: 'aggressive',
  });

  // Handle the case where articles might be undefined
  const articlesList = articles || [];
  const totalCount = articlesList.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const getDisplayTitle = (article: any) => {
    return article.title_en || article.title_zh || article.title || 'Untitled';
  };

  const filteredArticles = articlesList.filter(article => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    const title = getDisplayTitle(article).toLowerCase();
    const description = (article.description_en || article.description_zh || article.description || '').toLowerCase();
    const category = (article.category_en || article.category_zh || article.category || '').toLowerCase();
    const author = (article.author_name_en || article.author_name_zh || article.author_name || '').toLowerCase();
    
    return title.includes(searchLower) ||
           description.includes(searchLower) ||
           category.includes(searchLower) ||
           author.includes(searchLower);
  });

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleService.deleteArticle(id);
        refetch();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      // Find the article to determine current publish status
      const article = articlesList.find(a => a.id === id);
      if (!article) return;
      
      const currentlyPublished = isPublished(article);
      await articleService.togglePublishStatus(id, !currentlyPublished);
      refetch();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const isPublished = (article: any) => {
    return new Date(article.published_at) <= new Date();
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    articles: filteredArticles,
    totalCount,
    totalPages,
    isLoading,
    error,
    refetch,
    handleDeleteArticle,
    handleTogglePublish,
    isPublished,
    getDisplayTitle,
  };
};
