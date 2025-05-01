
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Edit, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { data: articleCount = 0, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['admin-article-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });
  
  const { data: authorCount = 0, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ['admin-author-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('authors')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });
  
  const { data: recentArticles = [], isLoading: isLoadingRecent } = useQuery({
    queryKey: ['admin-recent-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, category, published_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingArticles ? '...' : articleCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Published and draft articles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Authors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAuthors ? '...' : authorCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Content contributors
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
          <CardDescription>
            The most recently created articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRecent ? (
            <div className="text-center py-4">Loading...</div>
          ) : recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                        {article.category}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a href={`/admin/articles/edit/${article.id}`} className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4" />
                    </a>
                    <a href={`/insight/${article.id}`} className="p-1 hover:bg-gray-100 rounded" target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">No articles found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
