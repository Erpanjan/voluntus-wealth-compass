
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
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import MultilingualArticleContentSection from '@/components/admin/articles/MultilingualArticleContentSection';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import ArticlePreviewDialog from '@/components/admin/articles/ArticlePreviewDialog';

const ArticleEditor = () => {
  const { isEditMode, loadArticleData } = useMultilingualArticleData();
  
  const { 
    form, 
    selectedLanguage, 
    setSelectedLanguage, 
    hasContent 
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
          console.log('Loading existing multilingual data:', articleData);
          
          // Set form data with multilingual content
          form.reset({
            en: {
              title: articleData.en.title || '',
              description: articleData.en.description || '',
              content: articleData.en.content || '',
              category: articleData.en.category || '',
              author_name: articleData.en.author_name || '',
            },
            zh: {
              title: articleData.zh.title || '',
              description: articleData.zh.description || '',
              content: articleData.zh.content || '',
              category: articleData.zh.category || '',
              author_name: articleData.zh.author_name || '',
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

  const currentLanguageData = form.watch(selectedLanguage);

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
          />
        </div>

        <ArticlePreviewDialog
          open={previewOpen}
          setOpen={setPreviewOpen}
          title={currentLanguageData?.title || ''}
          description={currentLanguageData?.description || ''}
          content={currentLanguageData?.content || ''}
          imagePreview={imagePreview}
          category={currentLanguageData?.category || ''}
          authors={currentLanguageData?.author_name ? [{ id: '1', name: currentLanguageData.author_name, image_url: null }] : []}
          attachments={[]}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
