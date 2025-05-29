
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TiptapEditor from '@/components/admin/articles/TiptapEditor';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import { useArticleImage } from '@/hooks/admin/articleEditor';
import { unifiedArticleService } from '@/services/article/unifiedArticleService';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface MultilingualFormData {
  en: {
    title: string;
    description: string;
    content: string;
    category: string;
    author_name: string;
  };
  zh: {
    title: string;
    description: string;
    content: string;
    category: string;
    author_name: string;
  };
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

  const form = useForm<MultilingualFormData>({
    defaultValues: {
      en: {
        title: '',
        description: '',
        content: '',
        category: '',
        author_name: '',
      },
      zh: {
        title: '',
        description: '',
        content: '',
        category: '',
        author_name: '',
      },
      image_url: '',
      published_at: '',
    }
  });

  // Language switching with form state preservation
  const handleLanguageSwitch = (newLanguage: 'en' | 'zh') => {
    console.log('🌍 [LANGUAGE SWITCH] Switching from', selectedLanguage, 'to', newLanguage);
    setSelectedLanguage(newLanguage);
  };

  // Helper function to get current field value
  const getCurrentFieldValue = (fieldName: string) => {
    const formValues = form.getValues();
    const languageData = formValues[selectedLanguage];
    return languageData?.[fieldName as keyof typeof languageData] || '';
  };

  // Check if there's content in each language
  const hasContent = {
    en: Boolean(form.watch('en.title') || form.watch('en.content')),
    zh: Boolean(form.watch('zh.title') || form.watch('zh.content'))
  };

  // Load real article data from Supabase
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'No article ID provided',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      try {
        console.log(`🔍 [EDIT] Loading article with ID: ${id}`);
        
        const article = await unifiedArticleService.getMultilingualArticleById(id);

        if (!article) {
          toast({
            title: 'Article Not Found',
            description: 'Could not find the article you are trying to edit.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        console.log(`📊 [EDIT] Article loaded:`, {
          id: article.id,
          title_en: article.title_en,
          title_zh: article.title_zh,
          content_en_length: article.content_en?.length || 0,
          content_zh_length: article.content_zh?.length || 0
        });

        // Load existing image if available
        if (article.image_url) {
          loadImageData(article.image_url);
        }

        // Transform flat database structure to nested form structure
        const formData: MultilingualFormData = {
          en: {
            title: article.title_en || '',
            description: article.description_en || '',
            content: article.content_en || '', // Already processed by service layer
            category: article.category_en || '',
            author_name: article.author_name_en || '',
          },
          zh: {
            title: article.title_zh || '',
            description: article.description_zh || '',
            content: article.content_zh || '', // Already processed by service layer
            category: article.category_zh || '',
            author_name: article.author_name_zh || '',
          },
          image_url: article.image_url || '',
          published_at: article.published_at ? new Date(article.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };

        console.log(`✅ [EDIT] Setting form data:`, {
          en_content_length: formData.en.content.length,
          zh_content_length: formData.zh.content.length,
          en_title: formData.en.title,
          zh_title: formData.zh.title
        });
        
        form.reset(formData);
        setLoading(false);

      } catch (error) {
        console.error('💥 [EDIT] Error loading article:', error);
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

  // Save article with direct Supabase update (simplified approach)
  const handleSave = async (data: MultilingualFormData) => {
    if (!id) return;

    setSaving(true);
    try {
      console.log(`💾 [EDIT] Starting save for article ID: ${id}`);
      console.log('📊 [EDIT] Form data to save:', data);

      let imageUrl = data.image_url;

      // Handle image upload if provided
      if (imageFile) {
        console.log('📸 [EDIT] Uploading new image...');
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        // Try article-images bucket first, then article-assets as fallback
        let uploadData, uploadError;
        
        try {
          const { data: uploadResult, error } = await supabase.storage
            .from('article-images')
            .upload(fileName, imageFile);
          uploadData = uploadResult;
          uploadError = error;
        } catch (error) {
          console.log('📸 [EDIT] article-images bucket not found, trying article-assets...');
          const { data: uploadResult, error: fallbackError } = await supabase.storage
            .from('article-assets')
            .upload(fileName, imageFile);
          uploadData = uploadResult;
          uploadError = fallbackError;
        }

        if (uploadError) {
          console.error('💥 [EDIT] Error uploading image:', uploadError);
          throw new Error('Failed to upload image');
        }

        // Get public URL using the same bucket that worked
        let publicUrl;
        try {
          const { data: { publicUrl: url1 } } = supabase.storage
            .from('article-images')
            .getPublicUrl(fileName);
          publicUrl = url1;
        } catch {
          const { data: { publicUrl: url2 } } = supabase.storage
            .from('article-assets')
            .getPublicUrl(fileName);
          publicUrl = url2;
        }
        
        imageUrl = publicUrl;
        console.log('✅ [EDIT] Image uploaded successfully:', imageUrl);
      }

      // Convert date string to proper timestamp
      const publishedAtTimestamp = data.published_at 
        ? new Date(data.published_at + 'T00:00:00.000Z').toISOString()
        : new Date().toISOString();

      console.log('📅 [EDIT] Date conversion:', {
        original: data.published_at,
        converted: publishedAtTimestamp
      });

      // Prepare clean update data - store content as HTML strings (not jsonb objects)
      const updateData = {
        title_en: data.en.title?.trim() || '',
        title_zh: data.zh.title?.trim() || '',
        description_en: data.en.description?.trim() || '',
        description_zh: data.zh.description?.trim() || '',
        content_en: data.en.content || '', // Store as HTML string
        content_zh: data.zh.content || '', // Store as HTML string
        category_en: data.en.category?.trim() || '',
        category_zh: data.zh.category?.trim() || '',
        author_name_en: data.en.author_name?.trim() || '',
        author_name_zh: data.zh.author_name?.trim() || '',
        image_url: imageUrl,
        published_at: publishedAtTimestamp,
        updated_at: new Date().toISOString(),
      };

      console.log('🔄 [EDIT] Final update data:', {
        id,
        titles: { en: updateData.title_en, zh: updateData.title_zh },
        content_lengths: { 
          en: updateData.content_en.length, 
          zh: updateData.content_zh.length 
        },
        published_at: updateData.published_at,
        image_url: updateData.image_url ? 'has image' : 'no image'
      });

      // Direct Supabase update with detailed error handling
      const { data: updateResult, error: updateError } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select('id, title_en, title_zh, updated_at')
        .single();

      if (updateError) {
        console.error('💥 [EDIT] Database update error:', updateError);
        console.error('💥 [EDIT] Error details:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        });
        throw updateError;
      }

      if (!updateResult) {
        console.error('💥 [EDIT] No result returned from update');
        throw new Error('Update operation returned no result');
      }

      console.log('✅ [EDIT] Article updated successfully:', updateResult);

      toast({
        title: 'Success',
        description: 'Article updated successfully.',
      });

    } catch (error: any) {
      console.error('💥 [EDIT] Save operation failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle preview functionality
  const handlePreview = () => {
    const formData = form.getValues();
    const currentContent = formData[selectedLanguage];
    
    toast({
      title: 'Preview',
      description: `Previewing ${selectedLanguage === 'en' ? 'English' : 'Chinese'} version: "${currentContent.title}"`,
    });
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
              onClick={handlePreview}
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
              {saving ? 'Saving...' : 'Update Article'}
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
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageSwitch}
                  hasContent={hasContent}
                />
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
              <CardContent>
                <MultilingualArticleBasicInfoSection
                  form={form}
                  selectedLanguage={selectedLanguage}
                  getCurrentFieldValue={getCurrentFieldValue}
                />
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
                  name={`${selectedLanguage}.content`}
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
