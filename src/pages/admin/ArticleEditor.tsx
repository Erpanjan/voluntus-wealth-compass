
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Clock, Save, Eye, Upload, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  
  const isEditMode = !!id;

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      author: '',
      image_url: '',
      published_at: format(new Date(), 'yyyy-MM-dd'),
    }
  });
  
  // Fetch existing article data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setArticle(data);
            
            // Convert content to HTML if it exists
            const contentHtml = Array.isArray(data.content) && data.content.length > 0
              ? data.content[0].content || ''
              : data.description || '';
            
            setHtmlContent(contentHtml);
            setPreviewUrl(data.image_url || null);
            
            // Populate form values
            form.reset({
              title: data.title,
              description: data.description,
              category: data.category,
              author: '', // Will be populated below
              image_url: data.image_url || '',
              published_at: format(new Date(data.published_at), 'yyyy-MM-dd'),
            });
            
            // Fetch article author
            if (id) {
              const { data: authorJoins, error: authorError } = await supabase
                .from('article_authors')
                .select('author_id')
                .eq('article_id', id);
                
              if (!authorError && authorJoins && authorJoins.length > 0) {
                const authorId = authorJoins[0].author_id;
                const { data: authorData } = await supabase
                  .from('authors')
                  .select('name')
                  .eq('id', authorId)
                  .single();
                  
                if (authorData) {
                  form.setValue('author', authorData.name);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching article:', error);
          toast({
            title: 'Error',
            description: 'Failed to load article data',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchArticle();
    }
  }, [id, form, toast, isEditMode]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-article.${fileExt}`;
      const filePath = `article-images/${fileName}`;
      
      // Check if storage bucket exists, create if needed
      const { data: bucketData } = await supabase
        .storage.getBucket('article-images');
        
      if (!bucketData) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('article-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleSubmit = async (data: any, publish = false) => {
    setSubmitting(true);
    
    try {
      // Handle image upload if there's a new image
      let imageUrl = data.image_url;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      // Prepare article data
      const articleData = {
        title: data.title,
        description: data.description,
        category: data.category,
        content: [{ type: 'html', content: htmlContent }] as Json,
        image_url: imageUrl,
        published_at: publish 
          ? new Date().toISOString() 
          : new Date(data.published_at).toISOString(),
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      };
      
      let articleId = id;
      
      if (isEditMode) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new article
        const { data: newArticle, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select();
          
        if (error) throw error;
        
        articleId = newArticle[0].id;
      }
      
      // Handle author
      if (articleId && data.author) {
        // Check if author exists
        const { data: existingAuthor } = await supabase
          .from('authors')
          .select('id')
          .eq('name', data.author)
          .single();
          
        let authorId;
        
        if (!existingAuthor) {
          // Create new author
          const { data: newAuthor, error: authorError } = await supabase
            .from('authors')
            .insert({
              name: data.author,
            })
            .select();
            
          if (authorError) throw authorError;
          
          authorId = newAuthor[0].id;
        } else {
          authorId = existingAuthor.id;
        }
        
        // Delete existing author association
        if (isEditMode) {
          await supabase
            .from('article_authors')
            .delete()
            .eq('article_id', articleId);
        }
        
        // Create author association
        const { error: joinError } = await supabase
          .from('article_authors')
          .insert({
            article_id: articleId,
            author_id: authorId
          });
          
        if (joinError) throw joinError;
      }
      
      toast({
        title: 'Success',
        description: publish 
          ? 'Article published successfully' 
          : (isEditMode ? 'Article updated successfully' : 'Article saved as draft'),
      });
      
      // Redirect to articles management
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    // For now, just show a toast indicating preview functionality
    toast({
      title: 'Preview',
      description: 'Article preview functionality will be implemented soon.',
    });
  };

  const handlePublishNow = () => {
    form.handleSubmit((data) => handleSubmit(data, true))();
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
            Back to Articles
          </Button>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handlePreview}
            disabled={submitting}
          >
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          <Button 
            variant="outline"
            onClick={form.handleSubmit((data) => handleSubmit(data, false))}
            disabled={submitting}
          >
            <Save size={16} className="mr-2" />
            {submitting ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            onClick={handlePublishNow}
            disabled={submitting}
          >
            <Send size={16} className="mr-2" />
            {submitting ? 'Publishing...' : 'Publish Now'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter article category"
                              {...field}
                            />
                          </FormControl>
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
                              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                type="date"
                                className="pl-8"
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
                  
                  <div className="space-y-2">
                    <Label>Feature Image</Label>
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                      <div>
                        <div className="border border-input rounded-md p-2 bg-background">
                          <div className="relative">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageChange}
                              className="p-1"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Upload an image for your article (max 10MB)
                        </p>
                      </div>
                      {previewUrl && (
                        <div className="w-20 h-20 overflow-hidden rounded-md border">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter author name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The name of the article's author
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Article Content</Label>
                    <RichTextEditor
                      value={htmlContent}
                      onChange={setHtmlContent}
                    />
                    <p className="text-sm text-muted-foreground">
                      Create and format your article content
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Status</CardTitle>
              <CardDescription>
                Control when your article is published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="text-sm">
                    {form.watch('published_at') && (
                      <>
                        Will be published on:{' '}
                        <span className="font-medium">
                          {format(new Date(form.watch('published_at')), 'MMMM d, yyyy')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="text-sm">
                    {new Date(form.watch('published_at')) > new Date() ? (
                      <span className="text-yellow-600">Scheduled</span>
                    ) : (
                      <span className="text-green-600">Ready to publish</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  // Set publish date to now
                  form.setValue('published_at', format(new Date(), 'yyyy-MM-dd'));
                }}
              >
                Set Publish Date to Today
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>
                Ways to share your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Eye size={16} className="mr-2" /> Preview Article
                </Button>
                <p className="text-xs text-muted-foreground">
                  See how your article will look when published
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Save size={16} className="mr-2" /> Save as Draft
                </Button>
                <p className="text-xs text-muted-foreground">
                  Save your progress without publishing
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button size="sm" className="justify-start">
                  <Send size={16} className="mr-2" /> Publish Now
                </Button>
                <p className="text-xs text-muted-foreground">
                  Make your article visible to readers immediately
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
