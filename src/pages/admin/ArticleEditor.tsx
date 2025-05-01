
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useArticleEditor } from '@/hooks/useArticleEditor';

// Import the components
import ArticleHeader from '@/components/admin/articles/ArticleHeader';
import ArticleEditorContent from '@/components/admin/articles/ArticleEditorContent';
import { useToast } from '@/hooks/use-toast';

const ArticleEditor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const {
    loading,
    submitting,
    htmlContent,
    setHtmlContent,
    formValues,
    previewUrl,
    isEditMode,
    fetchArticle,
    handleImageChange,
    handleSubmit,
    handleFormChange,
    cleanup
  } = useArticleEditor(id);

  // Fetch existing article data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchArticle();
    }
    
    // Clean up on unmount
    return () => {
      cleanup();
    };
  }, [isEditMode]);
  
  // Handler functions
  const handlePreview = () => {
    if (!formValues.title.trim()) {
      toast({
        title: 'Missing title',
        description: 'Please enter a title for your article',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Preview',
      description: 'Article preview functionality will be implemented soon.',
    });
  };

  const handlePublishNow = () => {
    if (!formValues.title.trim()) {
      toast({
        title: 'Missing title',
        description: 'Please enter a title for your article',
        variant: 'destructive',
      });
      return;
    }
    
    handleSubmit(formValues, true);
  };

  const handleSaveDraft = () => {
    if (!formValues.title.trim()) {
      toast({
        title: 'Missing title',
        description: 'Please enter a title for your article',
        variant: 'destructive',
      });
      return;
    }
    
    handleSubmit(formValues, false);
  };

  return (
    <AdminLayout>
      <ArticleHeader 
        isEditMode={isEditMode}
        handlePreview={handlePreview}
        handleSaveDraft={handleSaveDraft}
        handlePublishNow={handlePublishNow}
        submitting={submitting}
      />
      
      <ArticleEditorContent
        formValues={formValues}
        handleFormChange={handleFormChange}
        htmlContent={htmlContent}
        setHtmlContent={setHtmlContent}
        previewUrl={previewUrl}
        handleImageChange={handleImageChange}
        loading={loading}
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onPublishNow={handlePublishNow}
      />
    </AdminLayout>
  );
};

export default ArticleEditor;
