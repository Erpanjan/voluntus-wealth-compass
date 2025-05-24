
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useArticleBasicInfo } from '@/hooks/admin/articleEditor/useArticleBasicInfo';
import { useArticleImage } from '@/hooks/admin/articleEditor/useArticleImage';
import { useArticlePreview } from '@/hooks/admin/articleEditor/useArticlePreview';
import { useArticleActions } from '@/hooks/admin/articleEditor/useArticleActions';
import ArticleInfoSection from '@/components/admin/articles/ArticleInfoSection';
import ArticleContentSection from '@/components/admin/articles/ArticleContentSection';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import ArticlePreviewDialog from '@/components/admin/articles/ArticlePreviewDialog';

const ArticleEditor = () => {
  const { form, isEditMode, loadArticleData } = useArticleBasicInfo();
  const { 
    imageFile, setImageFile, 
    imagePreview, setImagePreview, 
    fileInputRef, handleImageChange, handleRemoveImage, loadImageData 
  } = useArticleImage();
  const { previewOpen, setPreviewOpen, openPreview } = useArticlePreview();
  const { submitting, navigateBack, saveDraft, publishArticle } = useArticleActions();
  
  // Load article data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      if (!isEditMode) return;
      
      const articleData = await loadArticleData();
      if (articleData) {
        loadImageData(articleData.image_url);
      }
    };
    
    loadData();
  }, [isEditMode]);

  const handleSaveDraft = async () => {
    const formData = form.getValues();
    await saveDraft(formData, imageFile);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    await publishArticle(formData, imageFile);
  };

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
          <ArticleInfoSection
            form={form}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
          
          <ArticleContentSection form={form} />
        </div>

        <ArticlePreviewDialog
          open={previewOpen}
          setOpen={setPreviewOpen}
          title={form.getValues().title}
          description={form.getValues().description}
          content={form.getValues().content}
          imagePreview={imagePreview}
          category={form.getValues().category}
          authors={form.getValues().author_name ? [{ id: '1', name: form.getValues().author_name, image_url: null }] : []}
          attachments={[]}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
