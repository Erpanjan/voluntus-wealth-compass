import React, { useState } from 'react';
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

// Since the database tables for articles don't exist, we'll create a placeholder component
// You can later add the necessary tables to your Supabase database

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
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
  
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    
    try {
      // This is a placeholder for future functionality
      // When you create the articles table in your database,
      // you can implement the actual save functionality here
      
      toast({
        title: 'Feature not available',
        description: 'The article management functionality requires database setup. Please set up the necessary tables in your Supabase database.',
      });
      
      // For demonstration purposes only
      console.log('Article data that would be saved:', data);
      
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
