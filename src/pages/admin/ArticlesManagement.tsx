import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { articleService } from '@/services/article';
import DatabaseNotice from '@/components/admin/articles/DatabaseNotice';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'zh'>('all');
  const pageSize = 10;

  const { data: articlesData, isLoading, error, refetch } = useOptimizedQuery({
    queryKey: ['admin-articles', currentPage, pageSize],
    queryFn: () => articleService.getArticles(currentPage, pageSize),
    priority: 'high',
    cacheStrategy: 'aggressive',
  });

  // Handle the case where articlesData might be an array (fallback) or the expected object
  const articles = Array.isArray(articlesData) ? articlesData : articlesData?.articles || [];
  const totalCount = Array.isArray(articlesData) ? articlesData.length : articlesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const filteredArticles = articles.filter(article => {
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

  const handleCreateArticle = () => {
    navigate('/admin/articles/create');
  };

  const handleEditArticle = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };

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
      await articleService.togglePublishStatus(id);
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
      badges.push(<Badge key="en" variant="secondary" className="text-xs">EN</Badge>);
    }
    if (article.title_zh && article.title_zh.trim() !== '') {
      badges.push(<Badge key="zh" variant="secondary" className="text-xs">中文</Badge>);
    }
    return badges;
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
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
            <p className="text-gray-600 mt-2">Manage your multilingual articles and content</p>
          </div>
          <Button onClick={handleCreateArticle} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </div>

        <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'all' | 'en' | 'zh')}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Languages</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="zh">中文</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
          </div>

          <TabsContent value={selectedLanguage} className="mt-6">
            {isLoading ? (
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
            ) : filteredArticles.length > 0 ? (
              <>
                <div className="grid gap-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                              {article.title || 'Untitled'}
                            </h3>
                            <div className="flex gap-1">
                              {getLanguageBadges(article)}
                            </div>
                            <Badge variant={isPublished(article) ? "default" : "secondary"}>
                              {isPublished(article) ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          
                          {article.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {article.description}
                            </p>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            {article.category && (
                              <span className="flex items-center">
                                <Filter className="mr-1 h-3 w-3" />
                                {article.category}
                              </span>
                            )}
                            {article.author_name && <span>By {article.author_name}</span>}
                            <span>
                              {isPublished(article) 
                                ? `Published ${new Date(article.published_at).toLocaleDateString()}`
                                : `Updated ${new Date(article.updated_at).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditArticle(article.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish(article.id)}
                          >
                            {isPublished(article) ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No articles match your search "${searchTerm}"`
                    : selectedLanguage !== 'all'
                      ? `No articles available in ${selectedLanguage === 'en' ? 'English' : 'Chinese'}`
                      : 'Get started by creating your first article'
                  }
                </p>
                <Button onClick={handleCreateArticle}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ArticlesManagement;
