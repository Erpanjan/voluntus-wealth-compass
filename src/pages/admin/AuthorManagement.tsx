
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Sample/mock data for authors
const SAMPLE_AUTHORS = [
  {
    id: '1',
    name: 'John Smith',
    bio: 'John is a senior financial advisor with over 15 years of experience.',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Doe',
    bio: 'Jane specializes in retirement planning and investment strategies.',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Robert Johnson',
    bio: 'Robert is an expert in market analysis and portfolio management.',
    image_url: null,
    created_at: new Date().toISOString(),
  }
];

const AuthorManagement = () => {
  const { toast } = useToast();
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        // This would normally fetch from the authors table in the database
        // const { data, error } = await supabase
        //   .from('authors')
        //   .select('*')
        //   .order('name');
        
        // For now, use sample data
        setTimeout(() => {
          setAuthors(SAMPLE_AUTHORS);
          setLoading(false);
        }, 800); // Simulate loading
      } catch (error) {
        console.error('Error fetching authors:', error);
        setLoading(false);
      }
    };
    
    fetchAuthors();
  }, []);

  const handleOpenDialog = (author?: any) => {
    if (author) {
      setEditingAuthor(author);
      setName(author.name);
      setBio(author.bio || '');
      setImageUrl(author.image_url || '');
    } else {
      setEditingAuthor(null);
      setName('');
      setBio('');
      setImageUrl('');
    }
    
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const authorData = {
        name,
        bio,
        image_url: imageUrl,
      };

      let updatedAuthors;

      // If editing an existing author
      if (editingAuthor) {
        // This would normally update an author in the database
        // const { error } = await supabase
        //   .from('authors')
        //   .update(authorData)
        //   .eq('id', editingAuthor.id);

        // Update the author in the local state
        updatedAuthors = authors.map(author =>
          author.id === editingAuthor.id
            ? { ...author, ...authorData }
            : author
        );

        toast({
          title: "Author updated",
          description: "The author has been updated successfully.",
        });
      } 
      // If creating a new author
      else {
        // This would normally insert a new author in the database
        // const { data, error } = await supabase
        //   .from('authors')
        //   .insert(authorData)
        //   .select()
        //   .single();

        // Create a new author with a mock ID and add to the local state
        const newAuthor = {
          id: (authors.length + 1).toString(),
          ...authorData,
          created_at: new Date().toISOString(),
        };
        updatedAuthors = [...authors, newAuthor];

        toast({
          title: "Author created",
          description: "The author has been created successfully.",
        });
      }
      
      setAuthors(updatedAuthors);
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving author:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the author.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        // This would normally delete an author from the database
        // const { error } = await supabase
        //   .from('authors')
        //   .delete()
        //   .eq('id', id);

        // Remove the author from the local state
        setAuthors(authors.filter(author => author.id !== id));
        
        toast({
          title: "Author deleted",
          description: "The author has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting author:', error);
        toast({
          title: "Error deleting author",
          description: "An error occurred while deleting the author.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Author Management</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Add New Author
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
              <strong>Note:</strong> The author management functionality requires additional database setup. To use this feature, please set up the necessary tables in your Supabase database.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No authors found</h3>
          <p className="mt-1 text-gray-500">Add an author to get started</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell className="max-w-md truncate">{author.bio}</TableCell>
                  <TableCell>
                    {author.image_url ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <img src={author.image_url} alt={author.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                        {author.name.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(author.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(author)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAuthor(author.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAuthor ? 'Edit Author' : 'Add New Author'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Author's full name"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief biography or description"
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="image-url" className="block text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/author-image.jpg"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Author'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AuthorManagement;
