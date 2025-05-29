
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import DatabaseNotice from '@/components/admin/articles/DatabaseNotice';
import ArticlesHeader from '@/components/admin/articles/ArticlesHeader';
import ArticlesFiltersSection from '@/components/admin/articles/ArticlesFiltersSection';
import ArticlesContent from '@/components/admin/articles/ArticlesContent';
import { useArticlesManagement } from '@/hooks/admin/useArticlesManagement';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    selectedLanguage,
    setSelectedLanguage,
    articles,
    totalPages,
    isLoading,
    error,
    refetch,
    handleDeleteArticle,
    handleTogglePublish,
    isPublished,
    getLanguageBadges,
  } = useArticlesManagement();

  const handleCreateArticle = () => {
    navigate('/admin/articles/create');
  };

  const handleEditArticle = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <DatabaseNotice />
          <div className="text-center py-12">
            <p className="text-red-600">Error loading articles: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DatabaseNotice />
        <ArticlesHeader onCreateArticle={handleCreateArticle} />

        <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'all' | 'en' | 'zh')}>
          <ArticlesFiltersSection
            selectedLanguage={selectedLanguage}
            onLanguageChange={(value) => setSelectedLanguage(value as 'all' | 'en' | 'zh')}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <ArticlesContent
            selectedLanguage={selectedLanguage}
            articles={articles}
            isLoading={isLoading}
            searchTerm={searchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            onCreateArticle={handleCreateArticle}
            onEdit={handleEditArticle}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDeleteArticle}
            onPageChange={setCurrentPage}
            isPublished={isPublished}
            getLanguageBadges={getLanguageBadges}
          />
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ArticlesManagement;
