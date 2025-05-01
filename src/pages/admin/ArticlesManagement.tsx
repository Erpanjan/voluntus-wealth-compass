
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleTable from '@/components/admin/articles/ArticleTable';
import ArticleSearch from '@/components/admin/articles/ArticleSearch';
import DatabaseNotice from '@/components/admin/articles/DatabaseNotice';
import { useArticles } from '@/hooks/useArticles';
import { Card, CardContent } from '@/components/ui/card';

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
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="all" className="px-4">All Articles</TabsTrigger>
                <TabsTrigger value="published" className="px-4">Published</TabsTrigger>
                <TabsTrigger value="drafts" className="px-4">Drafts</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center w-full md:w-auto space-x-2">
                <ArticleSearch 
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
                <Button variant="outline" size="icon" className="hidden md:flex">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0 p-0">
              <ArticleTable 
                articles={filteredArticles}
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="published" className="m-0 p-0">
              <ArticleTable 
                articles={filteredArticles.filter(article => new Date(article.published_at) <= new Date())}
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="drafts" className="m-0 p-0">
              <ArticleTable 
                articles={filteredArticles.filter(article => new Date(article.published_at) > new Date())}
                loading={loading}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ArticlesManagement;
