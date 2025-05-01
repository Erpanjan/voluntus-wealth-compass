
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArticleData, AuthorData, Tables } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const useArticleEditor = (id?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  
  const isEditMode = !!id;

  // Initial form values
  const defaultFormValues = {
    title: '',
    description: '',
    category: '',
    author: '',
    image_url: '',
    published_at: format(new Date(), 'yyyy-MM-dd'),
  };
  
  const [formValues, setFormValues] = useState(defaultFormValues);
  
  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('articles') as any)
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setArticle(data as ArticleData);
        
        // Convert content to HTML if it exists
        let contentHtml = '';
        if (data.content) {
          if (Array.isArray(data.content)) {
            const contentItem = data.content[0] as any;
            contentHtml = contentItem && contentItem.content ? contentItem.content : '';
          } else if (typeof data.content === 'object' && data.content !== null) {
            // Handle if content is an object
            contentHtml = (data.content as any).content || '';
          } else {
            contentHtml = data.description || '';
          }
        }
        
        setHtmlContent(contentHtml);
        setPreviewUrl(data.image_url || null);
        
        // Populate form values
        setFormValues({
          title: data.title,
          description: data.description,
          category: data.category || '',
          author: '', // Will be populated below
          image_url: data.image_url || '',
          published_at: format(new Date(data.published_at), 'yyyy-MM-dd'),
        });
        
        // Fetch article author
        if (id) {
          const { data: authorJoins, error: authorError } = await (supabase
            .from('article_authors') as any)
            .select('author_id')
            .eq('article_id', id);
            
          if (!authorError && authorJoins && authorJoins.length > 0) {
            const authorId = authorJoins[0].author_id;
            const { data: authorData } = await (supabase
              .from('authors') as any)
              .select('name')
              .eq('id', authorId)
              .single();
              
            if (authorData) {
              setFormValues(prev => ({
                ...prev,
                author: authorData.name
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-article.${fileExt}`;
      const filePath = `article-images/${fileName}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  
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
      
      // Prepare article data
      const articleData: ArticleData = {
        title: data.title,
        description: data.description,
        category: data.category,
        content: [{ type: 'html', content: htmlContent }],
        image_url: imageUrl,
        published_at: publish 
          ? new Date().toISOString() 
          : new Date(data.published_at).toISOString(),
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      };
      
      let articleId = id;
      
      if (isEditMode && id) {
        // Update existing article
        const { error } = await (supabase
          .from('articles') as any)
          .update(articleData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new article
        const { data: newArticle, error } = await (supabase
          .from('articles') as any)
          .insert(articleData)
          .select();
          
        if (error) throw error;
        
        if (newArticle && newArticle.length > 0) {
          articleId = newArticle[0].id;
        }
      }
      
      // Handle author
      if (articleId && data.author) {
        // Check if author exists
        const { data: existingAuthor } = await (supabase
          .from('authors') as any)
          .select('id')
          .eq('name', data.author)
          .single();
          
        let authorId;
        
        if (!existingAuthor) {
          // Create new author
          const { data: newAuthor, error: authorError } = await (supabase
            .from('authors') as any)
            .insert({
              name: data.author,
            })
            .select();
            
          if (authorError) throw authorError;
          
          if (newAuthor && newAuthor.length > 0) {
            authorId = newAuthor[0].id;
          }
        } else {
          authorId = existingAuthor.id;
        }
        
        // Delete existing author association
        if (isEditMode && articleId) {
          await (supabase
            .from('article_authors') as any)
            .delete()
            .eq('article_id', articleId);
        }
        
        // Create author association
        if (authorId) {
          const { error: joinError } = await (supabase
            .from('article_authors') as any)
            .insert({
              article_id: articleId,
              author_id: authorId
            });
            
          if (joinError) throw joinError;
        }
      }
      
      toast({
        title: 'Success',
        description: publish 
          ? 'Article published successfully' 
          : (isEditMode ? 'Article updated successfully' : 'Article saved as draft'),
      });
      
      // Redirect to articles management
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    loading,
    submitting,
    article,
    imageFile,
    previewUrl,
    htmlContent,
    setHtmlContent,
    formValues,
    isEditMode,
    fetchArticle,
    handleImageChange,
    handleSubmit,
    handleFormChange
  };
};
