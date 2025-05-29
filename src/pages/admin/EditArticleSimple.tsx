import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TiptapEditor from '@/components/admin/articles/TiptapEditor';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import { useArticleImage } from '@/hooks/admin/articleEditor';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface ArticleFormData {
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  content_en: string;
  content_zh: string;
  category_en: string;
  category_zh: string;
  author_name_en: string;
  author_name_zh: string;
  image_url: string;
  published_at: string;
}

const EditArticleSimple = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'zh'>('en');

  // Image handling
  const {
    imageFile,
    imagePreview,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    loadImageData,
  } = useArticleImage();

  const form = useForm<ArticleFormData>({
    defaultValues: {
      title_en: '',
      title_zh: '',
      description_en: '',
      description_zh: '',
      content_en: '',
      content_zh: '',
      category_en: '',
      category_zh: '',
      author_name_en: '',
      author_name_zh: '',
      image_url: '',
      published_at: '',
    }
  });

  // Handle language switching with content preservation
  const handleLanguageSwitch = (newLanguage: 'en' | 'zh') => {
    console.log('🌍 [LANGUAGE SWITCH] Switching from', selectedLanguage, 'to', newLanguage);
    
    // Get current form values
    const currentValues = form.getValues();
    
    // Save current field values to the appropriate language fields
    if (selectedLanguage === 'en') {
      // Save current values to English fields
      form.setValue('title_en', currentValues[`title_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('description_en', currentValues[`description_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('category_en', currentValues[`category_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('author_name_en', currentValues[`author_name_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('content_en', currentValues[`content_${selectedLanguage}` as keyof ArticleFormData] as string);
    } else {
      // Save current values to Chinese fields
      form.setValue('title_zh', currentValues[`title_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('description_zh', currentValues[`description_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('category_zh', currentValues[`category_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('author_name_zh', currentValues[`author_name_${selectedLanguage}` as keyof ArticleFormData] as string);
      form.setValue('content_zh', currentValues[`content_${selectedLanguage}` as keyof ArticleFormData] as string);
    }
    
    // Trigger form validation to ensure all values are saved
    form.trigger();
    
    console.log('🔄 [LANGUAGE SWITCH] Saved current values and switching to', newLanguage);
    setSelectedLanguage(newLanguage);
  };

  // Load article data directly from database
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'No article ID provided',
          variant: 'destructive',
        });
        return;
      }

      try {
        console.log(`🔍 [SIMPLE EDIT] Loading article with ID: ${id}`);
        
        // Direct database query to get the article
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('❌ [SIMPLE EDIT] Database error:', error);
          throw error;
        }

        if (!data) {
          toast({
            title: 'Article Not Found',
            description: 'Could not find the article you are trying to edit.',
            variant: 'destructive',
          });
          return;
        }

        console.log(`📊 [SIMPLE EDIT] Raw article data:`, data);

        // Process content - handle both string and object types
        const processContent = (content: any): string => {
          if (!content) return '';
          if (typeof content === 'string') return content;
          if (typeof content === 'object') return JSON.stringify(content);
          return String(content);
        };

        const formData: ArticleFormData = {
          title_en: data.title_en || '',
          title_zh: data.title_zh || '',
          description_en: data.description_en || '',
          description_zh: data.description_zh || '',
          content_en: processContent(data.content_en),
          content_zh: processContent(data.content_zh),
          category_en: data.category_en || '',
          category_zh: data.category_zh || '',
          author_name_en: data.author_name_en || '',
          author_name_zh: data.author_name_zh || '',
          image_url: data.image_url || '',
          published_at: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : '',
        };

        // Load existing image if available
        if (formData.image_url) {
          loadImageData(formData.image_url);
        }

        console.log(`✅ [SIMPLE EDIT] Processed form data:`, {
          content_en_length: formData.content_en.length,
          content_zh_length: formData.content_zh.length,
          content_en_preview: formData.content_en.substring(0, 100) + '...',
          content_zh_preview: formData.content_zh.substring(0, 100) + '...',
          image_url: formData.image_url
        });

        form.reset(formData);
        setLoading(false);

      } catch (error) {
        console.error('💥 [SIMPLE EDIT] Error loading article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article data. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, form, toast, loadImageData]);

  const handleSave = async (data: ArticleFormData) => {
    setSaving(true);
    try {
      console.log(`💾 [SIMPLE EDIT] Saving article with ID: ${id}`);
      
      let finalImageUrl = imagePreview || data.image_url;

      // Handle image upload if there's a new file
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('article-assets')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('article-assets')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('articles')
        .update({
          title_en: data.title_en,
          title_zh: data.title_zh,
          description_en: data.description_en,
          description_zh: data.description_zh,
          content_en: data.content_en,
          content_zh: data.content_zh,
          category_en: data.category_en,
          category_zh: data.category_zh,
          author_name_en: data.author_name_en,
          author_name_zh: data.author_name_zh,
          image_url: finalImageUrl,
          published_at: data.published_at ? new Date(data.published_at).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('❌ [SIMPLE EDIT] Save error:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Article saved successfully.',
      });

      console.log(`✅ [SIMPLE EDIT] Article saved successfully`);
    } catch (error) {
      console.error('💥 [SIMPLE EDIT] Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading article...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/articles')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </Button>
            <h1 className="text-2xl font-semibold">Edit Article</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              Preview
            </Button>
            <Button
              type="submit"
              form="article-form"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Article'}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form id="article-form" onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            {/* Language Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedLanguage} onValueChange={handleLanguageSwitch}>
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="zh">中文</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Feature Image Section */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleImageUpload
                  imagePreview={imagePreview}
                  fileInputRef={fileInputRef}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </CardContent>
            </Card>

            {/* Article Information */}
            <Card>
              <CardHeader>
                <CardTitle>Article Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={selectedLanguage === 'en' ? 'title_en' : 'title_zh'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title ({selectedLanguage === 'en' ? 'English' : '中文'})</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter article title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={selectedLanguage === 'en' ? 'category_en' : 'category_zh'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category ({selectedLanguage === 'en' ? 'English' : '中文'})</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={selectedLanguage === 'en' ? 'description_en' : 'description_zh'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description ({selectedLanguage === 'en' ? 'English' : '中文'})</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter article description" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={selectedLanguage === 'en' ? 'author_name_en' : 'author_name_zh'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author ({selectedLanguage === 'en' ? 'English' : '中文'})</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter author name" />
                        </FormControl>
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
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Article Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content ({selectedLanguage === 'en' ? 'English' : '中文'})</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={selectedLanguage === 'en' ? 'content_en' : 'content_zh'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          languageKey={selectedLanguage}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default EditArticleSimple;
