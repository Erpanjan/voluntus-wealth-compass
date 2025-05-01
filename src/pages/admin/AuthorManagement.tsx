
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, UserCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const AuthorManagement = () => {
  const { toast } = useToast();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image_url: '',
  });

  // Fetch authors
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .order('name');

        if (error) throw error;
        
        setAuthors(data || []);
      } catch (error) {
        console.error('Error fetching authors:', error);
        toast({
          title: 'Error',
          description: 'Failed to load authors',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddAuthor = () => {
    setEditingAuthor(null);
    setFormData({
      name: '',
      bio: '',
      image_url: '',
    });
    setDialogOpen(true);
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      bio: author.bio || '',
      image_url: author.image_url || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteAuthor = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        const { error } = await supabase
          .from('authors')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Update local state
        setAuthors(authors.filter(author => author.id !== id));

        toast({
          title: 'Success',
          description: 'Author deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting author:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete author',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingAuthor) {
        // Update existing author
        const { error } = await supabase
          .from('authors')
          .update(formData)
          .eq('id', editingAuthor.id);

        if (error) throw error;

        // Update local state
        setAuthors(authors.map(author => 
          author.id === editingAuthor.id ? { ...author, ...formData } : author
        ));

        toast({
          title: 'Success',
          description: 'Author updated successfully',
        });
      } else {
        // Create new author
        const { data, error } = await supabase
          .from('authors')
          .insert(formData)
          .select();

        if (error) throw error;

        // Update local state
        setAuthors([...authors, data[0]]);

        toast({
          title: 'Success',
          description: 'Author added successfully',
        });
      }

      // Close dialog and reset form
      setDialogOpen(false);
      setFormData({
        name: '',
        bio: '',
        image_url: '',
      });
    } catch (error) {
      console.error('Error saving author:', error);
      toast({
        title: 'Error',
        description: 'Failed to save author',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Author Management</h1>
        <Button onClick={handleAddAuthor}>
          <PlusCircle size={16} className="mr-2" />
          Add New Author
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              onEdit={() => handleEditAuthor(author)}
              onDelete={() => handleDeleteAuthor(author.id)}
            />
          ))}

          {authors.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
              <UserCircle size={64} className="text-gray-300 mb-3" />
              <h3 className="text-lg font-medium">No authors yet</h3>
              <p className="text-gray-500 mb-4">Add your first author to get started</p>
              <Button onClick={handleAddAuthor}>
                <PlusCircle size={16} className="mr-2" />
                Add Author
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAuthor ? 'Edit Author' : 'Add New Author'}</DialogTitle>
            <DialogDescription>
              {editingAuthor 
                ? 'Update author information' 
                : 'Add a new author to the platform'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Author full name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right pt-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Author biography"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingAuthor ? 'Update' : 'Add'} Author
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

interface AuthorCardProps {
  author: any;
  onEdit: () => void;
  onDelete: () => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {author.image_url ? (
            <img 
              src={author.image_url} 
              alt={author.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 text-lg font-medium">
                {author.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="font-medium">{author.name}</h3>
          </div>
        </div>
        <div className="flex">
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
            <Pencil size={16} />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-red-600">
            <Trash2 size={16} />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 line-clamp-3">{author.bio || 'No biography available.'}</p>
      </div>
    </div>
  );
};

export default AuthorManagement;
