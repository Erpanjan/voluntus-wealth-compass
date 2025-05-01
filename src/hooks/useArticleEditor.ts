
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticleForm } from './useArticleForm';
import { useImageUpload } from './useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { 
  getArticleById, 
  createArticle, 
  updateArticle 
} from '@/services/mockArticleService';

export const useArticleEditor = (id?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!id;
  
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
  const fetchArticle = async () => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const article = await getArticleById(id);
      
      if (article) {
        const formData = {
          title: article.title,
          description: article.description,
          category: article.category,
          author: article.author,
          image_url: article.image_url,
          published_at: article.published_at,
        };
        
        return {
          formData,
          contentHtml: article.content
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article data',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
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
    setSubmitting(true);
    
    try {
      // Handle image upload if there's a new image
      let imageUrl = data.image_url;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      let success = false;
      
      if (isEditMode && id) {
        // Update existing article
        const result = await updateArticle(id, data, htmlContent, imageUrl, publish);
        success = !!result;
      } else {
        // Create new article
        const result = await createArticle(data, htmlContent, imageUrl, publish);
        success = !!result;
      }
      
      if (success) {
        toast({
          title: 'Success',
          description: publish 
            ? 'Article published successfully' 
            : 'Article saved as draft',
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save article',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
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
