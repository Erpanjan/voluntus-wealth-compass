
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  FileText,
  Filter
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Sample/mock data for articles
const SAMPLE_ARTICLES = [
  {
    id: '1',
    title: 'Understanding Financial Planning',
    slug: 'understanding-financial-planning',
    description: 'An overview of financial planning principles',
    category: 'Finance',
    published_at: new Date().toISOString(),
    authors: [
      { id: '1', name: 'John Smith', image_url: null },
      { id: '2', name: 'Jane Doe', image_url: null }
    ]
  },
  {
    id: '2',
    title: 'Investment Strategies for 2025',
    slug: 'investment-strategies-2025',
    description: 'Key investment strategies to consider for the coming year',
    category: 'Investing',
    published_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    authors: [
      { id: '1', name: 'John Smith', image_url: null }
    ]
  },
  {
    id: '3',
    title: 'Retirement Planning Basics',
    slug: 'retirement-planning-basics',
    description: 'Essential steps for planning your retirement',
    category: 'Planning',
    published_at: new Date().toISOString(),
    authors: [
      { id: '3', name: 'Robert Johnson', image_url: null },
      { id: '4', name: 'Mary Williams', image_url: null },
      { id: '5', name: 'David Brown', image_url: null }
    ]
  }
];

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Placeholder for when the actual database tables are created
        // This would normally be a Supabase call to fetch articles
        // const { data, error } = await supabase
        //   .rpc('get_articles_with_authors');
        
        // For now, we'll use sample data
        setTimeout(() => {
          setArticles(SAMPLE_ARTICLES);
          setLoading(false);
        }, 800); // Simulate loading
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
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
      try {
        // Placeholder for when the actual database tables are created
        // This would normally be a Supabase call to delete an article
        // const { error } = await supabase
        //   .from('articles')
        //   .delete()
        //   .eq('id', id);
          
        // For now, we'll just filter the articles array
        setArticles(articles.filter(article => article.id !== id));
        
        toast({
          title: "Article deleted",
          description: "The article has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting article:', error);
        toast({
          title: "Error deleting article",
          description: "An error occurred while deleting the article.",
          variant: "destructive",
        });
      }
    }
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
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> The article management functionality requires additional database setup. To use this feature, please set up the necessary tables in your Supabase database.
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all" className="px-4">All Articles</TabsTrigger>
            <TabsTrigger value="published" className="px-4">Published</TabsTrigger>
            <TabsTrigger value="drafts" className="px-4">Drafts</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search articles..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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

interface ArticleTableProps {
  articles: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({ 
  articles, 
  loading,
  onEdit,
  onView, 
  onDelete 
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-lg font-medium">No articles found</h3>
        <p className="mt-1 text-gray-500">Create a new article to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => {
            const isPublished = new Date(article.published_at) <= new Date();
            
            return (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{article.category}</Badge>
                </TableCell>
                <TableCell>
                  {isPublished ? (
                    <Badge className="bg-green-500 text-white">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(article.published_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {article.authors && article.authors.length > 0 ? (
                    <div className="flex -space-x-2">
                      {article.authors.slice(0, 3).map((author: any, index: number) => (
                        <div key={index} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                          {author.image_url ? (
                            <img src={author.image_url} alt={author.name} className="w-full h-full object-cover" />
                          ) : (
                            author.name.charAt(0)
                          )}
                        </div>
                      ))}
                      {article.authors.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                          +{article.authors.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(article.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onView(article.slug)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(article.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArticlesManagement;
