
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useMultilingualForm } from '@/hooks/admin/articleEditor/useMultilingualForm';
import { useArticleImage } from '@/hooks/admin/articleEditor/useArticleImage';
import { useArticlePreview } from '@/hooks/admin/articleEditor/useArticlePreview';
import { useArticleActions } from '@/hooks/admin/articleEditor/useArticleActions';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import MultilingualArticleContentSection from '@/components/admin/articles/MultilingualArticleContentSection';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import ArticlePreviewDialog from '@/components/admin/articles/ArticlePreviewDialog';
import { useParams } from 'react-router-dom';

const ArticleEditor = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
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
  const { submitting, navigateBack, saveDraft, publishArticle } = useArticleActions();
  
  // Load article data if in edit mode
  useEffect(() => {
    // TODO: Load multilingual article data when in edit mode
    // This will be implemented when connecting to Supabase
  }, [isEditMode]);

  const handleSaveDraft = async () => {
    const formData = form.getValues();
    // TODO: Transform multilingual data for backend
    console.log('Saving multilingual draft:', formData);
    // await saveDraft(formData, imageFile);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    // TODO: Transform multilingual data for backend
    console.log('Publishing multilingual article:', formData);
    // await publishArticle(formData, imageFile);
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
