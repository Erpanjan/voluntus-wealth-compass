
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ArrowLeft, Save } from 'lucide-react';
import ArticleInfoSection from '@/components/admin/articles/ArticleInfoSection';
import ArticleContentSection from '@/components/admin/articles/ArticleContentSection';
import { handleImageUpload, clearImageUpload } from '@/utils/imageUtils';

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
  
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    
    try {
      // This is a placeholder for future functionality
      // When you create the articles table in your database,
      // you can implement the actual save functionality here
      
      // Log the data being submitted including authors
      console.log("Submitting article data:", {
        ...data,
        authors: selectedAuthors,
        image: imageFile ? "Image file present" : "No image"
      });
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: isEditMode ? 'Article Updated' : 'Article Created',
          description: isEditMode 
            ? `The article has been updated successfully with ${selectedAuthors.length} author(s).` 
            : `The article has been created successfully with ${selectedAuthors.length} author(s).`,
        });
        
        navigate('/admin/articles');
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while trying to save the article.',
        variant: 'destructive',
      });
    } finally {
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

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/articles')}
            className="mr-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
        </div>
        
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={submitting}
        >
          <Save size={16} className="mr-2" />
          {submitting ? 'Saving...' : 'Save Article'}
        </Button>
      </div>
      
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
    </AdminLayout>
  );
};

export default ArticleEditor;
