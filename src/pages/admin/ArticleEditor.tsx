
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
  const [authors, setAuthors] = useState<any[]>([]);
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
    // Fetch authors for the dropdown (currently placeholder)
    const fetchAuthors = async () => {
      // This would normally fetch from the authors table
      // const { data, error } = await supabase.from('authors').select('*');
      
      // For now, use sample data
      setAuthors([
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Jane Doe' },
        { id: '3', name: 'Robert Johnson' }
      ]);
    };

    fetchAuthors();
    
    // If in edit mode, fetch the article data
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          // This would normally fetch from the articles table
          // const { data, error } = await supabase
          //   .from('articles')
          //   .select('*')
          //   .eq('id', id)
          //   .single();
          
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
            
            // Fetch article authors
            // const { data: authorData, error: authorError } = await supabase
            //   .from('article_authors')
            //   .select('author_id')
            //   .eq('article_id', id);
            
            // For now, assume these authors for the sample article
            setSelectedAuthors(['1', '2']);
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
      
      // Example of how it would work with proper tables:
      // If editing an existing article
      // if (isEditMode) {
      //   const { error } = await supabase
      //     .from('articles')
      //     .update({
      //       title: data.title,
      //       description: data.description,
      //       category: data.category,
      //       content: data.content,
      //       image_url: data.image_url,
      //       published_at: new Date(data.published_at).toISOString(),
      //       slug: slugify(data.title),
      //     })
      //     .eq('id', id);
      //
      //   // Handle author associations
      //   await supabase
      //     .from('article_authors')
      //     .delete()
      //     .eq('article_id', id);
      //
      //   for (const authorId of selectedAuthors) {
      //     await supabase
      //       .from('article_authors')
      //       .insert({
      //         article_id: id,
      //         author_id: authorId
      //       });
      //   }
      // } 
      // // If creating a new article
      // else {
      //   const { data: newArticle, error } = await supabase
      //     .from('articles')
      //     .insert({
      //       title: data.title,
      //       description: data.description,
      //       category: data.category,
      //       content: data.content,
      //       image_url: data.image_url,
      //       published_at: new Date(data.published_at).toISOString(),
      //       slug: slugify(data.title),
      //     })
      //     .select()
      //     .single();
      //
      //   // Handle author associations
      //   for (const authorId of selectedAuthors) {
      //     await supabase
      //       .from('article_authors')
      //       .insert({
      //         article_id: newArticle.id,
      //         author_id: authorId
      //       });
      //   }
      // }
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: isEditMode ? 'Article Updated' : 'Article Created',
          description: isEditMode 
            ? 'The article has been updated successfully.' 
            : 'The article has been created successfully.',
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
  
  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthors(current => {
      if (current.includes(authorId)) {
        return current.filter(id => id !== authorId);
      } else {
        return [...current, authorId];
      }
    });
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
          authors={authors}
          selectedAuthors={selectedAuthors}
          setSelectedAuthors={setSelectedAuthors}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
          fileInputRef={fileInputRef}
          handleAuthorChange={handleAuthorChange}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
        />
        
        <ArticleContentSection form={form} />
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor;
