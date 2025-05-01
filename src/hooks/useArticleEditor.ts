
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticleData } from './useArticleData';
import { useArticleForm } from './useArticleForm';
import { useImageUpload } from './useImageUpload';

export const useArticleEditor = (id?: string) => {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  
  const { 
    loading, 
    submitting, 
    isEditMode, 
    fetchArticle, 
    saveArticle 
  } = useArticleData(id);
  
  const {
    formValues,
    htmlContent,
    setHtmlContent,
    handleFormChange,
    setFormValues
  } = useArticleForm();
  
  const {
    imageFile,
    previewUrl,
    handleImageChange,
    uploadImage,
    cleanup
  } = useImageUpload();
  
  // Fetch existing article data if in edit mode
  useEffect(() => {
    const loadArticle = async () => {
      if (isEditMode && !initialized) {
        const result = await fetchArticle();
        if (result) {
          setFormValues(result.formData);
          setHtmlContent(result.contentHtml);
          setInitialized(true);
        }
      }
    };
    
    loadArticle();
  }, [isEditMode, initialized]);
  
  const handleSubmit = async (data: any, publish = false) => {
    // Handle image upload if there's a new image
    let imageUrl = data.image_url;
    
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }
    
    const success = await saveArticle(data, htmlContent, imageUrl, publish);
    if (success) {
      // Redirect to articles management
      navigate('/admin/articles');
    }
  };

  return {
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
  };
};
