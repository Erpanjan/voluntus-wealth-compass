
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useArticleEditor } from '@/hooks/admin/useArticleEditor';
import ArticleInfoSection from '@/components/admin/articles/ArticleInfoSection';
import ArticleContentSection from '@/components/admin/articles/ArticleContentSection';
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
    fileInputRef,
    previewOpen,
    setPreviewOpen,
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
      <ArticleEditorToolbar 
        isEditMode={isEditMode}
        submitting={submitting}
        onBack={navigateBack}
        onPreview={openPreview}
        onSaveDraft={saveDraft}
        onPublish={publishArticle}
      />
      
      <div className="space-y-6">
        <ArticleInfoSection
          form={form}
          selectedAuthors={selectedAuthors}
          setSelectedAuthors={setSelectedAuthors}
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
        authors={selectedAuthors}
      />
    </AdminLayout>
  );
};

export default ArticleEditor;
