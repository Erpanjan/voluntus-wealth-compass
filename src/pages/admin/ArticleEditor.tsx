
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import type { Json } from '@/integrations/supabase/types';

// Sample data for edit mode
const SAMPLE_ARTICLE = {
  id: '1',
  title: 'Understanding Financial Planning',
  slug: 'understanding-financial-planning',
  description: 'An overview of financial planning principles',
  content: 'This is the content of the article. It would normally be much longer.',
  category: 'Finance',
  image_url: 'https://example.com/image.jpg',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [authors, setAuthors] = useState<any[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  
  const isEditMode = !!id;

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      content: '',
      image_url: '',
      published_at: format(new Date(), 'yyyy-MM-dd'),
    }
  });
  
  useEffect(() => {
    // Fetch authors for the dropdown (currently placeholder)
    const fetchAuthors = async () => {
      // This would normally fetch from the authors table
      // const { data, error } = await supabase.from('authors').select('*');
      
      // For now, use sample data
      setAuthors([
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Jane Doe' },
        { id: '3', name: 'Robert Johnson' }
      ]);
    };

    fetchAuthors();
    
    // If in edit mode, fetch the article data
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          // This would normally fetch from the articles table
          // const { data, error } = await supabase
          //   .from('articles')
          //   .select('*')
          //   .eq('id', id)
          //   .single();
          
          // For now, use sample data
          const data = SAMPLE_ARTICLE;
          
          if (data) {
            form.reset({
              title: data.title,
              description: data.description,
              category: data.category,
              content: data.content as string,
              image_url: data.image_url,
              published_at: format(new Date(data.published_at), 'yyyy-MM-dd'),
            });
            
            // Fetch article authors
            // const { data: authorData, error: authorError } = await supabase
            //   .from('article_authors')
            //   .select('author_id')
            //   .eq('article_id', id);
            
            // For now, assume these authors for the sample article
            setSelectedAuthors(['1', '2']);
          }
        } catch (error) {
          console.error('Error fetching article:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch article data.',
            variant: 'destructive',
          });
        }
      };
      
      fetchArticle();
    }
  }, [id, isEditMode, form, toast]);
  
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    
    try {
      // This is a placeholder for future functionality
      // When you create the articles table in your database,
      // you can implement the actual save functionality here
      
      // Example of how it would work with proper tables:
      // If editing an existing article
      // if (isEditMode) {
      //   const { error } = await supabase
      //     .from('articles')
      //     .update({
      //       title: data.title,
      //       description: data.description,
      //       category: data.category,
      //       content: data.content,
      //       image_url: data.image_url,
      //       published_at: new Date(data.published_at).toISOString(),
      //       slug: slugify(data.title),
      //     })
      //     .eq('id', id);
      //
      //   // Handle author associations
      //   await supabase
      //     .from('article_authors')
      //     .delete()
      //     .eq('article_id', id);
      //
      //   for (const authorId of selectedAuthors) {
      //     await supabase
      //       .from('article_authors')
      //       .insert({
      //         article_id: id,
      //         author_id: authorId
      //       });
      //   }
      // } 
      // // If creating a new article
      // else {
      //   const { data: newArticle, error } = await supabase
      //     .from('articles')
      //     .insert({
      //       title: data.title,
      //       description: data.description,
      //       category: data.category,
      //       content: data.content,
      //       image_url: data.image_url,
      //       published_at: new Date(data.published_at).toISOString(),
      //       slug: slugify(data.title),
      //     })
      //     .select()
      //     .single();
      //
      //   // Handle author associations
      //   for (const authorId of selectedAuthors) {
      //     await supabase
      //       .from('article_authors')
      //       .insert({
      //         article_id: newArticle.id,
      //         author_id: authorId
      //       });
      //   }
      // }
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: isEditMode ? 'Article Updated' : 'Article Created',
          description: isEditMode 
            ? 'The article has been updated successfully.' 
            : 'The article has been created successfully.',
        });
        
        navigate('/admin/articles');
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while trying to save the article.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthors(current => {
      if (current.includes(authorId)) {
        return current.filter(id => id !== authorId);
      } else {
        return [...current, authorId];
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/articles')}
            className="mr-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
        </div>
        
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={submitting}
        >
          <Save size={16} className="mr-2" />
          {submitting ? 'Saving...' : 'Save Article'}
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
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Article Content</CardTitle>
          <CardDescription>
            Edit your article content and metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter article title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter article description" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Investing">Investing</SelectItem>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="Markets">Markets</SelectItem>
                          <SelectItem value="Analysis">Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="published_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="date"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Authors</FormLabel>
                <div className="grid grid-cols-2 mt-2 gap-2">
                  {authors.map(author => (
                    <div 
                      key={author.id}
                      className={`border rounded-md p-3 cursor-pointer ${
                        selectedAuthors.includes(author.id) 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleAuthorChange(author.id)}
                    >
                      {author.name}
                    </div>
                  ))}
                </div>
                {authors.length === 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    No authors available. Add authors in the Author Management section.
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your article content here..." 
                        rows={10}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Note: The article management functionality requires additional database setup.
          </p>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default ArticleEditor;
