
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MultilingualArticle } from '@/types/multilingual-article.types';

interface EditFormData {
  en: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  zh: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  image_url: string;
  published_at: string;
}

export const useSimpleEditHook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [articleData, setArticleData] = useState<EditFormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const loadArticle = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      console.log('🔄 Loading article for edit:', id);
      
      const { data, error } = await supabase.rpc('get_article_by_id_multilingual', {
        article_id: id
      });

      if (error) {
        console.error('❌ Error loading article:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No article found with ID:', id);
        toast({
          title: 'Article not found',
          description: 'The article you are trying to edit could not be found.',
          variant: 'destructive'
        });
        navigate('/admin/articles');
        return;
      }

      const article = data[0];
      console.log('✅ Article loaded successfully:', article);

      // Transform database response to form structure
      const formData: EditFormData = {
        en: {
          title: article.title_en || '',
          description: article.description_en || '',
          content: article.content_en || {},
          category: article.category_en || '',
          author_name: article.author_name_en || '',
        },
        zh: {
          title: article.title_zh || '',
          description: article.description_zh || '',
          content: article.content_zh || {},
          category: article.category_zh || '',
          author_name: article.author_name_zh || '',
        },
        image_url: article.image_url || '',
        published_at: article.published_at ? new Date(article.published_at).toISOString().split('T')[0] : '',
      };

      setArticleData(formData);
      setImagePreview(article.image_url || '');
      
      toast({
        title: 'Article loaded',
        description: 'Article data has been loaded successfully for editing.'
      });

    } catch (error) {
      console.error('💥 Error loading article:', error);
      toast({
        title: 'Error loading article',
        description: 'Failed to load article data. Please try again.',
        variant: 'destructive'
      });
      navigate('/admin/articles');
    } finally {
      setLoading(false);
    }
  }, [id, toast, navigate]);

  const saveArticle = useCallback(async (formData: EditFormData, imageFile?: File | null) => {
    if (!id) return;

    setSaving(true);
    try {
      console.log('💾 Saving article:', formData);

      let imageUrl = formData.image_url;

      // Handle image upload if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('❌ Error uploading image:', uploadError);
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Update article in database
      const { error } = await supabase
        .from('articles')
        .update({
          title_en: formData.en.title,
          title_zh: formData.zh.title,
          description_en: formData.en.description,
          description_zh: formData.zh.description,
          content_en: formData.en.content,
          content_zh: formData.zh.content,
          category_en: formData.en.category,
          category_zh: formData.zh.category,
          author_name_en: formData.en.author_name,
          author_name_zh: formData.zh.author_name,
          image_url: imageUrl,
          published_at: formData.published_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error saving article:', error);
        throw error;
      }

      console.log('✅ Article saved successfully');
      
      toast({
        title: 'Article saved',
        description: 'Your article has been saved successfully.'
      });

      navigate('/admin/articles');

    } catch (error) {
      console.error('💥 Error saving article:', error);
      toast({
        title: 'Error saving article',
        description: 'Failed to save article. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  }, [id, toast, navigate]);

  const publishArticle = useCallback(async (formData: EditFormData, imageFile?: File | null) => {
    const publishData = {
      ...formData,
      published_at: new Date().toISOString().split('T')[0]
    };
    await saveArticle(publishData, imageFile);
  }, [saveArticle]);

  return {
    id,
    loading,
    saving,
    articleData,
    imagePreview,
    setImagePreview,
    loadArticle,
    saveArticle,
    publishArticle,
    navigateBack: () => navigate('/admin/articles')
  };
};
