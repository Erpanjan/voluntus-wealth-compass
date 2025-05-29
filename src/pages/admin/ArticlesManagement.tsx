
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
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
    articles,
    totalPages,
    isLoading,
    error,
    refetch,
    handleDeleteArticle,
    handleTogglePublish,
    isPublished,
    getDisplayTitle,
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
        <ArticlesHeader onCreateArticle={handleCreateArticle} />

        <ArticlesFiltersSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ArticlesContent
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
          getDisplayTitle={getDisplayTitle}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticlesManagement;
