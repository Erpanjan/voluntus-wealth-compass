
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Edit, Plus, Trash2, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AuthorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: authors, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const handleDeleteAuthor = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete author "${name}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('authors')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Author deleted successfully');
        refetch();
      } catch (error) {
        console.error('Error deleting author:', error);
        toast.error('Error deleting author');
      }
    }
  };
  
  const filteredAuthors = authors?.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Author Management</h1>
        <p className="text-muted-foreground">Manage content contributors and their profiles.</p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Authors</CardTitle>
            <CardDescription>
              Manage your content creators and contributors
            </CardDescription>
          </div>
          <Button onClick={() => alert('Create author functionality to be implemented')}>
            <Plus className="mr-2 h-4 w-4" /> New Author
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search authors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading authors. Please try again later.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAuthors && filteredAuthors.length > 0 ? (
            <div className="space-y-4">
              {filteredAuthors.map(author => (
                <div key={author.id} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {author.image_url ? (
                        <img src={author.image_url} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{author.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {author.bio ? author.bio.substring(0, 50) + (author.bio.length > 50 ? '...' : '') : 'No bio available'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => alert(`Edit author: ${author.name}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteAuthor(author.id, author.name)}
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
                {searchTerm ? 'No authors found matching your search.' : 'No authors found.'}
              </p>
              <Button onClick={() => alert('Create author functionality to be implemented')}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Author
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorManagement;
