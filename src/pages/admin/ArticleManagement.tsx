
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface Author {
  id: string;
  name: string;
  image_url?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: any;
  category: string;
  image_url?: string;
  published_at: string;
  authors: Author[];
}

interface RawArticleResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: Json;
  category: string;
  image_url: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors: Json;
}

const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase.rpc('get_articles_with_authors');
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Transform the response into the Article type
  const articles: Article[] = (data as RawArticleResponse[]).map(item => ({
    ...item,
    authors: Array.isArray(item.authors) ? item.authors as Author[] : []
  }));
  
  return articles;
};

const ArticleManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: fetchArticles
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Article deleted successfully');
        refetch();
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error('Error deleting article');
      }
    }
  };
  
  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container-custom py-12">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Articles Management</CardTitle>
            <CardDescription>
              Manage your market insight articles and research
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/admin/articles/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search articles by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading articles. Please try again later.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map(article => (
                <div key={article.id} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                        {article.category}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(article.published_at)}</span>
                      <span className="mx-2">•</span>
                      <span>
                        By {article.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => window.open(`/insight/${article.slug}`, '_blank')}
                      title="View Article"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                      title="Edit Article"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      title="Delete Article"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No articles found matching your search.' : 'No articles found.'}
              </p>
              <Button onClick={() => navigate('/admin/articles/new')}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleManagement;
