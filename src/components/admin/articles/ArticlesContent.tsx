
import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ArticleGrid from './ArticleGrid';
import ArticlePagination from './ArticlePagination';

interface ArticlesContentProps {
  articles: any[];
  isLoading: boolean;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onCreateArticle: () => void;
  onEdit: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  isPublished: (article: any) => boolean;
  getDisplayTitle: (article: any) => string;
}

const ArticlesContent: React.FC<ArticlesContentProps> = ({
  articles,
  isLoading,
  searchTerm,
  currentPage,
  totalPages,
  onCreateArticle,
  onEdit,
  onTogglePublish,
  onDelete,
  onPageChange,
  isPublished,
  getDisplayTitle,
}) => {
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="mt-6">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No articles match your search "${searchTerm}"`
              : 'Get started by creating your first article'
            }
          </p>
          <Button onClick={onCreateArticle}>
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ArticleGrid
        articles={articles}
        onEdit={onEdit}
        onTogglePublish={onTogglePublish}
        onDelete={onDelete}
        isPublished={isPublished}
        getDisplayTitle={getDisplayTitle}
      />
      <ArticlePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ArticlesContent;
