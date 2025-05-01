
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useArticleEditor } from '@/hooks/admin/useArticleEditor';
import ArticleInfoSection from '@/components/admin/articles/ArticleInfoSection';
import ArticleContentSection from '@/components/admin/articles/ArticleContentSection';
import ArticleAttachmentsSection from '@/components/admin/articles/ArticleAttachmentsSection';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import ArticlePreviewDialog from '@/components/admin/articles/ArticlePreviewDialog';

const ArticleEditor = () => {
  const {
    form,
    isEditMode,
    submitting,
    selectedAuthors,
    setSelectedAuthors,
    imagePreview,
    setImagePreview,
    imageFile,
    setImageFile,
    fileInputRef,
    previewOpen,
    setPreviewOpen,
    attachments,
    setAttachments,
    loadArticleData,
    saveDraft,
    publishArticle,
    handleImageChange,
    handleRemoveImage,
    navigateBack,
    openPreview
  } = useArticleEditor();
  
  useEffect(() => {
    // Load article data if in edit mode
    loadArticleData();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <ArticleEditorToolbar 
          isEditMode={isEditMode}
          submitting={submitting}
          onBack={navigateBack}
          onPreview={openPreview}
          onSaveDraft={saveDraft}
          onPublish={publishArticle}
        />
        
        <div className="space-y-8">
          <ArticleInfoSection
            form={form}
            selectedAuthors={selectedAuthors}
            setSelectedAuthors={setSelectedAuthors}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
          
          <ArticleContentSection form={form} />
          
          <ArticleAttachmentsSection 
            form={form}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </div>

        <ArticlePreviewDialog
          open={previewOpen}
          setOpen={setPreviewOpen}
          title={form.getValues().title}
          description={form.getValues().description}
          content={form.getValues().content}
          imagePreview={imagePreview}
          category={form.getValues().category}
          authors={selectedAuthors}
          attachments={attachments}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
