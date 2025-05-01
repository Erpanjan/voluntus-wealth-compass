
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ArticleTable from '@/components/admin/articles/ArticleTable';
import ArticleSearch from '@/components/admin/articles/ArticleSearch';
import DatabaseNotice from '@/components/admin/articles/DatabaseNotice';
import { useArticles } from '@/hooks/useArticles';
import { Card, CardContent } from '@/components/ui/card';
import ArticleFilters from '@/components/admin/articles/ArticleFilters';
import { DateRange } from 'react-day-picker';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateRange: undefined as DateRange | undefined,
    author: ''
  });
  const { articles, loading, deleteArticle, updateArticleStatus } = useArticles();
  
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
    await deleteArticle(id);
  };
  
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    await updateArticleStatus(id, !currentStatus);
  };
  
  // Filter articles based on search term and filters
  const filteredArticles = articles.filter(article => {
    // Search term filter - search in title, content and author names
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.authors && article.authors.some((author: any) => 
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Category filter
    const matchesCategory = filters.category === '' || article.category === filters.category;
    
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
    
    // Author filter
    const matchesAuthor = filters.author === '' || 
      (article.authors && article.authors.some((author: any) => 
        author.id === filters.author || author.name.toLowerCase().includes(filters.author.toLowerCase())
      ));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange && matchesAuthor;
  });
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Articles Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your blog articles, insights, and publications</p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <Plus size={16} className="mr-2" />
          Create New Article
        </Button>
      </div>
      
      <DatabaseNotice />
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <ArticleSearch 
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <div className="md:col-span-1">
                  <ArticleFilters 
                    filters={filters}
                    setFilters={setFilters}
                    articles={articles}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <ArticleTable 
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
