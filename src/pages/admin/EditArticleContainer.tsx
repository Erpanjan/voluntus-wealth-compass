
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMultilingualForm } from '@/hooks/admin/articleEditor/useMultilingualForm';
import { useArticleImage } from '@/hooks/admin/articleEditor/useArticleImage';
import { useArticlePreview } from '@/hooks/admin/articleEditor/useArticlePreview';
import { useEditArticleActions } from '@/hooks/admin/articleEditor/useEditArticleActions';
import { useEditArticleData } from '@/hooks/admin/articleEditor/useEditArticleData';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import EditArticleForm from '@/components/admin/articles/EditArticleForm';

const EditArticleContainer = () => {
  const navigate = useNavigate();
  const { articleId } = useEditArticleData();
  
  const { 
    form, 
    selectedLanguage, 
    setSelectedLanguage, 
    hasContent,
    getCurrentFieldValue,
  } = useMultilingualForm();
  
  const { 
    imageFile, 
    imagePreview, 
    fileInputRef, 
    handleImageChange, 
    handleRemoveImage 
  } = useArticleImage();
  
  const { previewOpen, setPreviewOpen, openPreview } = useArticlePreview();
  const { submitting, navigateBack, updateDraft, updateAndPublish } = useEditArticleActions(articleId);

  const handleSaveDraft = async () => {
    const formData = form.getValues();
    await updateDraft({ ...formData, image_url: imagePreview }, imageFile);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    await updateAndPublish({ ...formData, image_url: imagePreview }, imageFile);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-16">
        <ArticleEditorToolbar 
          isEditMode={true}
          submitting={submitting}
          onBack={navigateBack}
          onPreview={openPreview}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublishArticle}
        />
        
        <EditArticleForm
          form={form}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          hasContent={hasContent}
          getCurrentFieldValue={getCurrentFieldValue}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          previewOpen={previewOpen}
          setPreviewOpen={setPreviewOpen}
        />
      </div>
    </AdminLayout>
  );
};

export default EditArticleContainer;
