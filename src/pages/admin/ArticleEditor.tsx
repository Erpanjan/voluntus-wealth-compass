
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArticleData, Tables } from '@/types/supabase';

// Import the components
import ArticleForm from '@/components/admin/articles/ArticleForm';
import ArticleStatusCard from '@/components/admin/articles/ArticleStatusCard';
import ArticlePublishingOptions from '@/components/admin/articles/ArticlePublishingOptions';
import ArticleHeader from '@/components/admin/articles/ArticleHeader';

const ArticleEditor = () => {
  const { id } = useParams();
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
  
  // Fetch existing article data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('articles')
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
              const { data: authorJoins, error: authorError } = await supabase
                .from('article_authors')
                .select('author_id')
                .eq('article_id', id);
                
              if (!authorError && authorJoins && authorJoins.length > 0) {
                const authorId = authorJoins[0].author_id;
                const { data: authorData } = await supabase
                  .from('authors')
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
      
      fetchArticle();
    }
  }, [id, toast, isEditMode]);
  
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
        const { error } = await supabase
          .from('articles')
          .update(articleData as Tables['articles'])
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new article
        const { data: newArticle, error } = await supabase
          .from('articles')
          .insert(articleData as Tables['articles'])
          .select();
          
        if (error) throw error;
        
        if (newArticle && newArticle.length > 0) {
          articleId = newArticle[0].id;
        }
      }
      
      // Handle author
      if (articleId && data.author) {
        // Check if author exists
        const { data: existingAuthor } = await supabase
          .from('authors')
          .select('id')
          .eq('name', data.author)
          .single();
          
        let authorId;
        
        if (!existingAuthor) {
          // Create new author
          const { data: newAuthor, error: authorError } = await supabase
            .from('authors')
            .insert({
              name: data.author,
            } as Tables['authors'])
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
          await supabase
            .from('article_authors')
            .delete()
            .eq('article_id', articleId);
        }
        
        // Create author association
        if (authorId) {
          const { error: joinError } = await supabase
            .from('article_authors')
            .insert({
              article_id: articleId,
              author_id: authorId
            } as Tables['article_authors']);
            
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

  // Handler functions
  const handlePreview = () => {
    toast({
      title: 'Preview',
      description: 'Article preview functionality will be implemented soon.',
    });
  };

  const handlePublishNow = () => {
    handleSubmit(formValues, true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout>
      <ArticleHeader 
        isEditMode={isEditMode}
        navigate={navigate}
        handlePreview={handlePreview}
        handleSaveDraft={() => handleSubmit(formValues, false)}
        handlePublishNow={handlePublishNow}
        submitting={submitting}
      />
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ArticleForm
            formValues={formValues}
            onChange={handleFormChange}
            htmlContent={htmlContent}
            setHtmlContent={setHtmlContent}
            previewUrl={previewUrl}
            handleImageChange={handleImageChange}
            loading={loading}
          />
        </div>
        
        <div className="space-y-6">
          <ArticleStatusCard 
            publishDate={formValues.published_at}
            setPublishDate={(date) => handleFormChange('published_at', date)}
          />
          
          <ArticlePublishingOptions 
            onPreview={handlePreview}
            onSaveDraft={() => handleSubmit(formValues, false)}
            onPublishNow={handlePublishNow}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
