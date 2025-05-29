
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import MultilingualArticleTable from '@/components/admin/articles/MultilingualArticleTable';
import ArticleSearch from '@/components/admin/articles/ArticleSearch';
import { useUnifiedArticles } from '@/hooks/useUnifiedArticles';
import { Card, CardContent } from '@/components/ui/card';
import ArticleFilters from '@/components/admin/articles/ArticleFilters';
import { DateRange } from 'react-day-picker';
import { MultilingualArticle } from '@/types/article.types';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateRange: undefined as DateRange | undefined,
    author: ''
  });
  
  const { 
    articles, 
    loading, 
    deleteArticle, 
    togglePublishStatus,
    refresh
  } = useUnifiedArticles({ mode: 'admin' });
  
  const handleCreateNew = () => {
    navigate('/admin/articles/create');
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };
  
  const handleView = (slug: string) => {
    window.open(`/insight/${slug}`, '_blank');
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id);
    }
  };
  
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    await togglePublishStatus(id, currentStatus);
  };

  const handleRefresh = () => {
    refresh();
  };
  
  // Filter articles based on search term and filters with multilingual support
  const filteredArticles: MultilingualArticle[] = (articles as MultilingualArticle[]).filter(article => {
    // Multilingual search - search across both language fields
    const matchesSearch = searchTerm === '' || 
      (article.title_en && article.title_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.title_zh && article.title_zh.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.author_name_en && article.author_name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.author_name_zh && article.author_name_zh.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter - check both language fields
    const matchesCategory = filters.category === '' || 
      article.category_en === filters.category || 
      article.category_zh === filters.category;
    
    // Status filter
    const isPublished = new Date(article.published_at) <= new Date();
    const matchesStatus = filters.status === '' || 
      (filters.status === 'published' && isPublished) || 
      (filters.status === 'draft' && !isPublished);
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange?.from) {
      matchesDateRange = new Date(article.published_at) >= new Date(filters.dateRange.from);
    }
    if (filters.dateRange?.to && matchesDateRange) {
      matchesDateRange = new Date(article.published_at) <= new Date(filters.dateRange.to);
    }
    
    // Author filter - check both language fields
    const matchesAuthor = filters.author === '' || 
      (article.author_name_en && article.author_name_en.toLowerCase().includes(filters.author.toLowerCase())) ||
      (article.author_name_zh && article.author_name_zh.toLowerCase().includes(filters.author.toLowerCase()));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange && matchesAuthor;
  });
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Articles Management</h1>
          <p className="text-gray-600 mt-1">Manage your multilingual articles and content</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus size={16} className="mr-2" />
            Create New Article
          </Button>
        </div>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <ArticleSearch 
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by title, content, or author (English & Chinese)..."
                  />
                </div>
                <div className="md:col-span-1">
                  <ArticleFilters 
                    filters={filters}
                    setFilters={setFilters}
                    articles={filteredArticles}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <MultilingualArticleTable 
            articles={filteredArticles}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ArticlesManagement;
