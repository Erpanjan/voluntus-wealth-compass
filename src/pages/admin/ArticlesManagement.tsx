
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
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
import { getAllArticles, deleteArticle } from '@/services/mockArticleService';

const ArticlesManagement = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
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
        const success = await deleteArticle(id);
        
        if (success) {
          // Remove the deleted article from the state
          setArticles(articles.filter(article => article.id !== id));
        }
      } catch (error) {
        console.error('Error deleting article:', error);
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
