
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TiptapEditor from '@/components/admin/articles/TiptapEditor';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import { useArticleImage } from '@/hooks/admin/articleEditor';
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

// Mock data for testing
const MOCK_ARTICLE_DATA = {
  id: '8905fc91-9acf-4a36-b1f0-9e4b3ad6a444',
  title_en: 'Sample English Article',
  title_zh: '示例中文文章',
  description_en: 'This is a sample English description for testing the edit functionality.',
  description_zh: '这是用于测试编辑功能的示例中文描述。',
  content_en: '<p>This is sample English content. You can edit this content and switch between languages to see how the form preserves your changes.</p>',
  content_zh: '<p>这是示例中文内容。您可以编辑此内容并在语言之间切换，以查看表单如何保留您的更改。</p>',
  category_en: 'Technology',
  category_zh: '技术',
  author_name_en: 'John Doe',
  author_name_zh: '张三',
  image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
  published_at: '2024-01-15T00:00:00.000Z'
};

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

  // Simple language switching
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

  // Load mock article data
  useEffect(() => {
    const loadMockArticle = () => {
      console.log(`🔍 [MOCK EDIT] Loading mock article with ID: ${id}`);
      
      try {
        // Simulate loading delay
        setTimeout(() => {
          console.log(`📊 [MOCK EDIT] Loading mock article data`);

          // Transform flat mock structure to nested multilingual structure
          const formData: MultilingualFormData = {
            en: {
              title: MOCK_ARTICLE_DATA.title_en,
              description: MOCK_ARTICLE_DATA.description_en,
              content: MOCK_ARTICLE_DATA.content_en,
              category: MOCK_ARTICLE_DATA.category_en,
              author_name: MOCK_ARTICLE_DATA.author_name_en,
            },
            zh: {
              title: MOCK_ARTICLE_DATA.title_zh,
              description: MOCK_ARTICLE_DATA.description_zh,
              content: MOCK_ARTICLE_DATA.content_zh,
              category: MOCK_ARTICLE_DATA.category_zh,
              author_name: MOCK_ARTICLE_DATA.author_name_zh,
            },
            image_url: MOCK_ARTICLE_DATA.image_url,
            published_at: new Date(MOCK_ARTICLE_DATA.published_at).toISOString().split('T')[0],
          };

          // Load existing image if available
          if (formData.image_url) {
            loadImageData(formData.image_url);
          }

          console.log(`✅ [MOCK EDIT] Processed multilingual form data:`, {
            en_content_length: formData.en.content.length,
            zh_content_length: formData.zh.content.length,
            en_title: formData.en.title,
            zh_title: formData.zh.title,
            image_url: formData.image_url
          });

          form.reset(formData);
          setLoading(false);
        }, 500); // Simulate network delay

      } catch (error) {
        console.error('💥 [MOCK EDIT] Error loading mock article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article data. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    loadMockArticle();
  }, [id, form, toast, loadImageData]);

  const handleSave = async (data: MultilingualFormData) => {
    setSaving(true);
    try {
      console.log(`💾 [MOCK EDIT] Saving article with ID: ${id}`);
      console.log('📊 [MOCK EDIT] Form data to save:', data);
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Article saved successfully. (This is using mock data)',
      });

      console.log(`✅ [MOCK EDIT] Article saved successfully`);
    } catch (error) {
      console.error('💥 [MOCK EDIT] Error saving article:', error);
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
            <p className="mt-2 text-gray-600">Loading mock article...</p>
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
            <h1 className="text-2xl font-semibold">Edit Article (Mock Mode)</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => toast({ title: 'Preview', description: 'Preview functionality (mock)' })}
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
