
import { useEffect } from 'react';
import { 
  useArticleBasicInfo,
  useArticleImage,
  useArticlePreview,
  useArticleActions
} from './articleEditor';

export const useArticleEditor = () => {
  const { form, isEditMode, loadArticleData } = useArticleBasicInfo();
  const { 
    imageFile, setImageFile, 
    imagePreview, setImagePreview, 
    fileInputRef, handleImageChange, handleRemoveImage, loadImageData 
  } = useArticleImage();
  const { previewOpen, setPreviewOpen, openPreview } = useArticlePreview();
  const { submitting, navigateBack, saveDraft, publishArticle } = useArticleActions();

  // Composite function to load all article data
  const loadAllArticleData = async () => {
    if (!isEditMode) return;
    
    // Load basic article data first
    const articleData = await loadArticleData();
    
    if (articleData) {
      // Load image data if available
      loadImageData(articleData.image_url);
    }
  };

  // Wrap saveDraft and publishArticle with correct arguments
  const handleSaveDraft = async () => {
    const formData = form.getValues();
    await saveDraft(formData, imageFile);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    await publishArticle(formData, imageFile);
  };

  return {
    // Form and basic info
    form,
    isEditMode,
    submitting,
    
    // Image
    imagePreview,
    setImagePreview,
    imageFile,
    setImageFile,
    fileInputRef,
    
    // Preview
    previewOpen,
    setPreviewOpen,
    
    // Methods
    loadArticleData: loadAllArticleData,
    saveDraft: handleSaveDraft,
    publishArticle: handlePublishArticle,
    handleImageChange,
    handleRemoveImage,
    navigateBack,
    openPreview
  };
};
