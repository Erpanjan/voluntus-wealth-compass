
import { useState } from 'react';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { articleService } from '@/services/article';
import { Article } from '@/services/article/types';

export const useArticlesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'zh'>('all');
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

  const filteredArticles = articlesList.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedLanguage === 'all') return matchesSearch;
    
    // Filter by language availability
    if (selectedLanguage === 'en') {
      return matchesSearch && article.title_en && article.title_en.trim() !== '';
    }
    if (selectedLanguage === 'zh') {
      return matchesSearch && article.title_zh && article.title_zh.trim() !== '';
    }
    
    return matchesSearch;
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

  const getLanguageBadges = (article: any) => {
    const badges = [];
    if (article.title_en && article.title_en.trim() !== '') {
      badges.push('EN');
    }
    if (article.title_zh && article.title_zh.trim() !== '') {
      badges.push('中文');
    }
    return badges;
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    selectedLanguage,
    setSelectedLanguage,
    articles: filteredArticles,
    totalCount,
    totalPages,
    isLoading,
    error,
    refetch,
    handleDeleteArticle,
    handleTogglePublish,
    isPublished,
    getLanguageBadges,
  };
};
