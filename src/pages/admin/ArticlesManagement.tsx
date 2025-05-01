
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleTable from '@/components/admin/articles/ArticleTable';
import ArticleSearch from '@/components/admin/articles/ArticleSearch';
import DatabaseNotice from '@/components/admin/articles/DatabaseNotice';
import { useArticles } from '@/hooks/useArticles';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { articles, loading, deleteArticle } = useArticles();
  
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
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Articles Management</h1>
        <Button onClick={handleCreateNew}>
          <Plus size={16} className="mr-2" />
          Create New Article
        </Button>
      </div>
      
      <DatabaseNotice />
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all" className="px-4">All Articles</TabsTrigger>
            <TabsTrigger value="published" className="px-4">Published</TabsTrigger>
            <TabsTrigger value="drafts" className="px-4">Drafts</TabsTrigger>
          </TabsList>
          
          <ArticleSearch 
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        
        <TabsContent value="all" className="mt-4">
          <ArticleTable 
            articles={filteredArticles}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="published" className="mt-4">
          <ArticleTable 
            articles={filteredArticles.filter(article => new Date(article.published_at) <= new Date())}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="drafts" className="mt-4">
          <ArticleTable 
            articles={filteredArticles.filter(article => new Date(article.published_at) > new Date())}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ArticlesManagement;
