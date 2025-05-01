
import React, { useState, useEffect, useRef } from 'react';
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowLeft, Calendar, Save, X, ChevronDown, ChevronUp, Upload, User, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

// Available categories for selection
const CATEGORIES = [
  'Finance',
  'Investing',
  'Planning',
  'Markets',
  'Analysis',
  'Retirement',
  'Taxes',
  'Estate Planning'
];

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [authors, setAuthors] = useState<any[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [infoExpanded, setInfoExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
            
            if (data.image_url) {
              setImagePreview(data.image_url);
            }
            
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image file size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }
    
    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      
      <div className="space-y-6">
        <Card>
          <Accordion
            type="single" 
            collapsible 
            defaultValue="article-info"
            className="border-none"
          >
            <AccordionItem value="article-info" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">Article Information</h2>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
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
                          <FormDescription>
                            The main title of your article
                          </FormDescription>
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
                          <FormDescription>
                            A brief summary of your article
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                {CATEGORIES.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Category of your article (e.g. Finance, Investing)
                            </FormDescription>
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
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  type="date"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              When the article should be published
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <FormLabel>Authors</FormLabel>
                      <FormDescription className="mb-3">
                        Select one or multiple authors for this article
                      </FormDescription>
                      <div className="space-y-2">
                        {authors.map(author => (
                          <div 
                            key={author.id}
                            className={`flex items-center p-3 rounded-md border ${
                              selectedAuthors.includes(author.id) 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200 hover:bg-gray-50'
                            } transition-colors cursor-pointer`}
                            onClick={() => handleAuthorChange(author.id)}
                          >
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <User size={16} />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{author.name}</p>
                            </div>
                            <div>
                              {selectedAuthors.includes(author.id) && (
                                <Badge variant="outline" className="bg-primary text-white border-primary">
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {authors.length === 0 && (
                          <p className="text-gray-500 text-sm">
                            No authors available. Add authors in the Author Management section.
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel>Feature Image</FormLabel>
                      <FormDescription className="mb-3">
                        Upload an image for your article (max 10MB)
                      </FormDescription>
                      
                      {imagePreview ? (
                        <div className="relative rounded-md overflow-hidden border border-gray-200 mb-2">
                          <img 
                            src={imagePreview} 
                            alt="Article feature" 
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max 10MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </form>
                </Form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
            <CardDescription>
              Write your article content using the editor below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your article content here..." 
                      rows={15}
                      className="min-h-[300px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
