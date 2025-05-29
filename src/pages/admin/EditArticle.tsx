
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MultilingualArticle, Report } from '@/types/multilingual-article.types';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import MultilingualArticleContentSection from '@/components/admin/articles/MultilingualArticleContentSection';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticlePreviewDialog from '@/components/admin/articles/MultilingualArticlePreviewDialog';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import { useArticleImage } from '@/hooks/admin/articleEditor/useArticleImage';

const multilingualArticleSchema = z.object({
  en: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.any().optional(),
    category: z.string().optional(),
    author_name: z.string().optional(),
  }),
  zh: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.any().optional(),
    category: z.string().optional(),
    author_name: z.string().optional(),
  }),
  image_url: z.string().optional(),
  published_at: z.string(),
});

type MultilingualArticleFormData = z.infer<typeof multilingualArticleSchema>;

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'zh'>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [originalArticle, setOriginalArticle] = useState<MultilingualArticle | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Integrate image upload functionality
  const {
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    loadImageData,
  } = useArticleImage();

  const form = useForm<MultilingualArticleFormData>({
    resolver: zodResolver(multilingualArticleSchema),
    defaultValues: {
      en: {
        title: '',
        description: '',
        content: {},
        category: '',
        author_name: '',
      },
      zh: {
        title: '',
        description: '',
        content: {},
        category: '',
        author_name: '',
      },
      image_url: '',
      published_at: new Date().toISOString().split('T')[0],
    },
  });

  // Load article data
  useEffect(() => {
    const loadArticleData = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'No article ID provided',
          variant: 'destructive',
        });
        navigate('/admin/articles');
        return;
      }

      try {
        console.log(`🔍 Loading article data for ID: ${id}`);
        
        const { data, error } = await supabase.rpc('get_article_by_id_multilingual', {
          article_id: id
        });

        if (error) {
          console.error('❌ Error fetching article:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          toast({
            title: 'Article Not Found',
            description: 'Could not find the article you are trying to edit.',
            variant: 'destructive',
          });
          navigate('/admin/articles');
          return;
        }

        const article = data[0];
        console.log(`📊 Raw article data:`, article);

        // Safe conversion of reports array with proper type handling
        let reports: Report[] = [];
        if (article.reports) {
          try {
            if (Array.isArray(article.reports)) {
              reports = (article.reports as unknown[]).map((report: any) => ({
                id: report.id || '',
                title: report.title || '',
                description: report.description || '',
                file_url: report.file_url || '',
                created_at: report.created_at || new Date().toISOString(),
              }));
            } else if (typeof article.reports === 'string') {
              const parsed = JSON.parse(article.reports);
              reports = Array.isArray(parsed) ? parsed.map((report: any) => ({
                id: report.id || '',
                title: report.title || '',
                description: report.description || '',
                file_url: report.file_url || '',
                created_at: report.created_at || new Date().toISOString(),
              })) : [];
            }
          } catch (error) {
            console.warn('Error parsing reports:', error);
            reports = [];
          }
        }

        // Process and store original article with proper type handling
        const processedArticle: MultilingualArticle = {
          id: article.id,
          slug: article.slug,
          image_url: article.image_url,
          published_at: article.published_at,
          created_at: article.created_at,
          updated_at: article.updated_at,
          title_en: article.title_en || '',
          title_zh: article.title_zh || '',
          description_en: article.description_en || '',
          description_zh: article.description_zh || '',
          content_en: article.content_en || {},
          content_zh: article.content_zh || {},
          category_en: article.category_en || '',
          category_zh: article.category_zh || '',
          author_name_en: article.author_name_en || '',
          author_name_zh: article.author_name_zh || '',
          authors: [],
          reports: reports,
        };

        setOriginalArticle(processedArticle);

        // Load existing image if available
        if (processedArticle.image_url) {
          loadImageData(processedArticle.image_url);
        }

        // Populate form with article data
        const formData: MultilingualArticleFormData = {
          en: {
            title: processedArticle.title_en,
            description: processedArticle.description_en,
            content: processedArticle.content_en,
            category: processedArticle.category_en,
            author_name: processedArticle.author_name_en,
          },
          zh: {
            title: processedArticle.title_zh,
            description: processedArticle.description_zh,
            content: processedArticle.content_zh,
            category: processedArticle.category_zh,
            author_name: processedArticle.author_name_zh,
          },
          image_url: processedArticle.image_url || '',
          published_at: processedArticle.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        };

        console.log(`✅ Populating form with data:`, formData);
        form.reset(formData);
        setRefreshKey(prev => prev + 1);

      } catch (error) {
        console.error('💥 Error loading article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
  }, [id, form, navigate, toast, loadImageData]);

  // Helper function to get current field value
  const getCurrentFieldValue = (fieldName: string): string => {
    const formData = form.getValues();
    const currentLangData = formData[currentLanguage];
    if (!currentLangData) return '';
    
    const value = (currentLangData as any)[fieldName];
    return typeof value === 'string' ? value : '';
  };

  const handleSave = async (formData: MultilingualArticleFormData) => {
    if (!id || !originalArticle) return;

    setSaving(true);
    try {
      console.log(`💾 Saving article with data:`, formData);

      let imageUrl = formData.image_url || '';

      // Handle image upload if new image is provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Prepare update data
      const updateData = {
        id: originalArticle.id,
        title_en: formData.en.title || '',
        title_zh: formData.zh.title || '',
        description_en: formData.en.description || '',
        description_zh: formData.zh.description || '',
        content_en: formData.en.content || {},
        content_zh: formData.zh.content || {},
        category_en: formData.en.category || '',
        category_zh: formData.zh.category || '',
        author_name_en: formData.en.author_name || '',
        author_name_zh: formData.zh.author_name || '',
        image_url: imageUrl,
        published_at: new Date(formData.published_at).toISOString(),
      };

      console.log(`📝 Updating article with data:`, updateData);

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', originalArticle.id);

      if (error) {
        console.error('❌ Error updating article:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Article updated successfully!',
      });

      navigate('/admin/articles');

    } catch (error) {
      console.error('💥 Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!originalArticle) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The article you're looking for could not be found.</p>
          <Button onClick={() => navigate('/admin/articles')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/articles')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Edit Article</h1>
              <p className="text-gray-600 mt-1">Update your multilingual article content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector
              selectedLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              hasContent={{
                en: !!(form.getValues().en?.title || form.getValues().en?.content),
                zh: !!(form.getValues().zh?.title || form.getValues().zh?.content)
              }}
            />
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
          <MultilingualArticleBasicInfoSection
            form={form}
            selectedLanguage={currentLanguage}
            getCurrentFieldValue={getCurrentFieldValue}
            refreshKey={refreshKey}
          />

          <MultilingualArticleContentSection
            form={form}
            selectedLanguage={currentLanguage}
            getCurrentFieldValue={getCurrentFieldValue}
            refreshKey={refreshKey}
          />

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Image</h3>
            <ArticleImageUpload
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/articles')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Update Article'}
            </Button>
          </div>
        </form>

        <MultilingualArticlePreviewDialog
          open={previewOpen}
          setOpen={setPreviewOpen}
          content={{
            en: {
              title: form.getValues().en?.title || '',
              description: form.getValues().en?.description || '',
              content: form.getValues().en?.content || '',
              category: form.getValues().en?.category || '',
              author_name: form.getValues().en?.author_name || '',
            },
            zh: {
              title: form.getValues().zh?.title || '',
              description: form.getValues().zh?.description || '',
              content: form.getValues().zh?.content || '',
              category: form.getValues().zh?.category || '',
              author_name: form.getValues().zh?.author_name || '',
            }
          }}
          imagePreview={imagePreview}
        />
      </div>
    </AdminLayout>
  );
};

export default EditArticle;
