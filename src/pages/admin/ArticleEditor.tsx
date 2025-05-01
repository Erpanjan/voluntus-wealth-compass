
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { handleImageUpload, clearImageUpload } from '@/utils/imageUtils';
import ArticleInfoSection from '@/components/admin/articles/ArticleInfoSection';
import ArticleContentSection from '@/components/admin/articles/ArticleContentSection';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import ArticlePreviewDialog from '@/components/admin/articles/ArticlePreviewDialog';

// Sample data for edit mode
const SAMPLE_ARTICLE = {
  id: '1',
  title: 'Understanding Financial Planning',
  slug: 'understanding-financial-planning',
  description: 'An overview of financial planning principles',
  content: 'This is the content of the article. It would normally be much longer.',
  category: 'Finance',
  image_url: 'https://example.com/image.jpg',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditMode = !!id;

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      content: '',
      image_url: '',
      published_at: format(new Date(), 'yyyy-MM-dd'),
    }
  });
  
  useEffect(() => {
    // If in edit mode, fetch the article data
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          // This would normally fetch from the articles table
          // For now, use sample data
          const data = SAMPLE_ARTICLE;
          
          if (data) {
            form.reset({
              title: data.title,
              description: data.description,
              category: data.category,
              content: data.content as string,
              image_url: data.image_url,
              published_at: format(new Date(data.published_at), 'yyyy-MM-dd'),
            });
            
            if (data.image_url) {
              setImagePreview(data.image_url);
            }
            
            // For now, assume these authors for the sample article
            setSelectedAuthors(['John Smith', 'Jane Doe']);
          }
        } catch (error) {
          console.error('Error fetching article:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch article data.',
            variant: 'destructive',
          });
        }
      };
      
      fetchArticle();
    }
  }, [id, isEditMode, form, toast]);

  // Save as draft function
  const saveDraft = async () => {
    setSubmitting(true);
    
    try {
      const formData = form.getValues();
      
      // Log the data being submitted
      console.log("Saving draft:", {
        ...formData,
        authors: selectedAuthors,
        image: imageFile ? "Image file present" : "No image",
        status: "draft"
      });
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: 'Draft Saved',
          description: 'Your article draft has been saved.',
        });
        setSubmitting(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the draft.',
        variant: 'destructive',
      });
      setSubmitting(false);
    }
  };
  
  // Publish function
  const publishArticle = async () => {
    setSubmitting(true);
    
    try {
      const formData = form.getValues();
      
      // Log the data being submitted including authors
      console.log("Publishing article:", {
        ...formData,
        authors: selectedAuthors,
        image: imageFile ? "Image file present" : "No image",
        status: "published"
      });
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: 'Article Published',
          description: `The article has been published successfully with ${selectedAuthors.length} author(s).`,
        });
        
        navigate('/admin/articles');
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while publishing the article.',
        variant: 'destructive',
      });
      setSubmitting(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleImageUpload(file, setImageFile, setImagePreview);
  };
  
  const handleRemoveImage = () => {
    clearImageUpload(fileInputRef, setImageFile, setImagePreview);
  };

  // Preview function
  const openPreview = () => {
    setPreviewOpen(true);
  };

  return (
    <AdminLayout>
      <ArticleEditorToolbar 
        isEditMode={isEditMode}
        submitting={submitting}
        onBack={() => navigate('/admin/articles')}
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
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
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
