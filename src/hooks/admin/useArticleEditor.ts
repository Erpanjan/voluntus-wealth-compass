
import { useEffect } from 'react';
import { 
  useArticleBasicInfo,
  useArticleAuthors,
  useArticleImage,
  useArticleAttachments,
  useArticlePreview,
  useArticleActions
} from './articleEditor';
import { Attachment } from './articleEditor/useArticleAttachments';
import { Author } from '@/services/articleService';

export const useArticleEditor = () => {
  const { form, isEditMode, loadArticleData } = useArticleBasicInfo();
  const { selectedAuthors, setSelectedAuthors, availableAuthors, loadAuthorsData } = useArticleAuthors(isEditMode);
  const { 
    imageFile, setImageFile, 
    imagePreview, setImagePreview, 
    fileInputRef, handleImageChange, handleRemoveImage, loadImageData 
  } = useArticleImage();
  const { attachments, setAttachments, loadAttachmentsData } = useArticleAttachments(isEditMode);
  const { previewOpen, setPreviewOpen, openPreview } = useArticlePreview();
  const { submitting, navigateBack, saveDraft, publishArticle } = useArticleActions();

  // Composite function to load all article data
  const loadAllArticleData = async () => {
    if (!isEditMode) return;
    
    // Load basic article data first
    const articleData = await loadArticleData();
    
    if (articleData) {
      // Once we have the article data, load related data
      loadAuthorsData();
      loadImageData(articleData.image_url);
      loadAttachmentsData();
    }
  };

  // Helper function to convert author IDs to Author objects
  const getAuthorObjects = (authorIds: string[]): Author[] => {
    return authorIds.map(id => {
      const author = availableAuthors.find(a => a.id === id);
      return author || { id, name: 'Unknown Author', image_url: null };
    });
  };

  // Wrap saveDraft and publishArticle to get data from their respective hooks
  const handleSaveDraft = async () => {
    const formData = form.getValues();
    const authorObjects = getAuthorObjects(selectedAuthors);
    await saveDraft(formData, authorObjects, imageFile, attachments as Attachment[]);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    const authorObjects = getAuthorObjects(selectedAuthors);
    await publishArticle(formData, authorObjects, imageFile, attachments as Attachment[]);
  };

  return {
    // Form and basic info
    form,
    isEditMode,
    submitting,
    
    // Authors
    selectedAuthors,
    setSelectedAuthors,
    
    // Image
    imagePreview,
    setImagePreview,
    imageFile,
    setImageFile,
    fileInputRef,
    
    // Preview
    previewOpen,
    setPreviewOpen,
    
    // Attachments
    attachments,
    setAttachments,
    
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
