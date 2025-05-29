
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useMultilingualForm } from '@/hooks/admin/articleEditor/useMultilingualForm';
import { useArticleImage } from '@/hooks/admin/articleEditor/useArticleImage';
import { useArticlePreview } from '@/hooks/admin/articleEditor/useArticlePreview';
import { useMultilingualArticleActions } from '@/hooks/admin/articleEditor/useMultilingualArticleActions';
import { useMultilingualArticleData } from '@/hooks/admin/articleEditor/useMultilingualArticleData';
import { convertToNestedStructure } from '@/utils/articleHelpers';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import MultilingualArticleContentSection from '@/components/admin/articles/MultilingualArticleContentSection';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import MultilingualArticlePreviewDialog from '@/components/admin/articles/MultilingualArticlePreviewDialog';

const ArticleEditor = () => {
  const { isEditMode, loadArticleData } = useMultilingualArticleData();
  
  const { 
    form, 
    selectedLanguage, 
    setSelectedLanguage, 
    hasContent,
    getCurrentFieldValue,
    refreshKey
  } = useMultilingualForm();
  
  const { 
    imageFile, setImageFile, 
    imagePreview, setImagePreview, 
    fileInputRef, handleImageChange, handleRemoveImage, loadImageData 
  } = useArticleImage();
  
  const { previewOpen, setPreviewOpen, openPreview } = useArticlePreview();
  const { submitting, navigateBack, saveDraft, publishArticle } = useMultilingualArticleActions();
  
  // Load article data if in edit mode
  useEffect(() => {
    const loadExistingData = async () => {
      if (isEditMode) {
        const articleData = await loadArticleData();
        if (articleData) {
          // Convert to nested structure for form
          const nestedData = convertToNestedStructure(articleData);
          
          // Set form data with multilingual content
          form.reset({
            en: {
              title: nestedData.en.title || '',
              description: nestedData.en.description || '',
              content: nestedData.en.content || '',
              category: nestedData.en.category || '',
              author_name: nestedData.en.author_name || '',
            },
            zh: {
              title: nestedData.zh.title || '',
              description: nestedData.zh.description || '',
              content: nestedData.zh.content || '',
              category: nestedData.zh.category || '',
              author_name: nestedData.zh.author_name || '',
            },
            image_url: articleData.image_url || '',
            published_at: articleData.published_at ? new Date(articleData.published_at).toISOString().split('T')[0] : '',
          });
          
          // Load image if available
          if (articleData.image_url) {
            loadImageData(articleData.image_url);
          }
        }
      }
    };
    
    loadExistingData();
  }, [isEditMode, loadArticleData, form, loadImageData]);

  const handleSaveDraft = async () => {
    const formData = form.getValues();
    await saveDraft({ ...formData, image_url: imagePreview }, imageFile);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    await publishArticle({ ...formData, image_url: imagePreview }, imageFile);
  };

  // Get all form data for preview
  const formData = form.watch();

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-16">
        <ArticleEditorToolbar 
          isEditMode={isEditMode}
          submitting={submitting}
          onBack={navigateBack}
          onPreview={openPreview}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublishArticle}
        />
        
        <div className="space-y-6">
          {/* Language Selector */}
          <Card className="p-6 border-gray-200 shadow-sm">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              hasContent={hasContent}
            />
          </Card>

          {/* Article Information */}
          <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Accordion
              type="single" 
              collapsible 
              defaultValue="article-info"
              className="border-none"
            >
              <AccordionItem value="article-info" className="border-none">
                <AccordionTrigger className="px-6 py-5 hover:no-underline bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Article Information
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 py-6 bg-white">
                  <Form {...form}>
                    <form className="space-y-8">
                      <MultilingualArticleBasicInfoSection 
                        form={form} 
                        selectedLanguage={selectedLanguage}
                        getCurrentFieldValue={getCurrentFieldValue}
                        refreshKey={refreshKey}
                      />
                      
                      <div className="border-t border-gray-100 pt-8"></div>
                      
                      <ArticleImageUpload
                        imagePreview={imagePreview}
                        fileInputRef={fileInputRef}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                      />
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
          
          {/* Article Content */}
          <MultilingualArticleContentSection 
            form={form} 
            selectedLanguage={selectedLanguage}
            getCurrentFieldValue={getCurrentFieldValue}
            refreshKey={refreshKey}
          />
        </div>

        <MultilingualArticlePreviewDialog
          open={previewOpen}
          setOpen={setPreviewOpen}
          content={{
            en: {
              title: formData?.en?.title || '',
              description: formData?.en?.description || '',
              content: formData?.en?.content || '',
              category: formData?.en?.category || '',
              author_name: formData?.en?.author_name || '',
            },
            zh: {
              title: formData?.zh?.title || '',
              description: formData?.zh?.description || '',
              content: formData?.zh?.content || '',
              category: formData?.zh?.category || '',
              author_name: formData?.zh?.author_name || '',
            }
          }}
          imagePreview={imagePreview}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
