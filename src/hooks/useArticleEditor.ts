
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface Author {
  id: string;
  name: string;
}

interface Article {
  id?: string;
  title: string;
  description: string;
  content: any[];
  category: string;
  image_url?: string;
}

interface ReportFile {
  file: File;
  title: string;
  description: string;
}

interface FetchedArticle {
  id: string;
  title: string;
  description: string;
  content: Json;
  category: string;
  image_url: string;
  authorIds: string[];
}

const fetchAuthors = async () => {
  const { data, error } = await supabase
    .from('authors')
    .select('id, name');
  
  if (error) throw error;
  return data || [];
};

const fetchArticle = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Fetch authors for this article
  const { data: articleAuthors, error: authorsError } = await supabase
    .from('article_authors')
    .select('author_id')
    .eq('article_id', id);
  
  if (authorsError) throw authorsError;
  
  return {
    ...data,
    authorIds: articleAuthors?.map(aa => aa.author_id) || []
  };
};

export function useArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewArticle = id === 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [article, setArticle] = useState<Article>({
    title: '',
    description: '',
    content: [],
    category: 'RESEARCH & INSIGHTS',
    image_url: ''
  });
  
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFiles, setReportFiles] = useState<ReportFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Fetch authors for the dropdown
  const { data: authors, isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors
  });
  
  // Fetch article data if editing
  const { data: existingArticle, isLoading: articleLoading } = useQuery({
    queryKey: ['edit-article', id],
    queryFn: () => fetchArticle(id!),
    enabled: !isNewArticle && !!id,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching article:", error);
        toast.error("Error loading article data");
      }
    }
  });
  
  // Initialize article data when fetched
  if (existingArticle && article.id !== existingArticle.id) {
    // Convert content to an array if necessary
    const contentArray = existingArticle.content 
      ? (Array.isArray(existingArticle.content) ? existingArticle.content : [existingArticle.content])
      : [];
      
    setArticle({
      id: existingArticle.id,
      title: existingArticle.title,
      description: existingArticle.description,
      content: contentArray,
      category: existingArticle.category,
      image_url: existingArticle.image_url
    });
    setSelectedAuthorIds(existingArticle.authorIds || []);
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (url: string) => {
    setArticle(prev => ({ ...prev, image_url: url }));
  };
  
  const handleAuthorSelection = (authorId: string) => {
    setSelectedAuthorIds(prev => {
      if (prev.includes(authorId)) {
        return prev.filter(id => id !== authorId);
      } else {
        return [...prev, authorId];
      }
    });
  };
  
  const handleContentChange = (content: any[]) => {
    setArticle(prev => ({ ...prev, content }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadProgress(1); // Start progress
      
      // Upload the image to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `article-images/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });
      
      if (error) throw error;
      
      setUploadProgress(50); // Mid progress
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      setUploadProgress(100); // Complete
      
      // Add to content blocks if we're adding content
      if (data) {
        setArticle(prev => ({
          ...prev,
          content: [
            ...(Array.isArray(prev.content) ? prev.content : []),
            {
              type: 'image',
              url: publicUrl,
              caption: 'Image caption'
            }
          ]
        }));
      } else {
        // Otherwise set as the main article image
        handleImageChange(publicUrl);
      }
      
      toast.success('Image uploaded successfully');
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };
  
  const handleAddReport = () => {
    setReportFiles(prev => [
      ...prev, 
      { file: new File([], ""), title: "", description: "" }
    ]);
  };
  
  const handleReportChange = (index: number, field: string, value: any) => {
    setReportFiles(prev => {
      const newReports = [...prev];
      newReports[index] = { ...newReports[index], [field]: value };
      return newReports;
    });
  };
  
  const handleReportFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setReportFiles(prev => {
      const newReports = [...prev];
      newReports[index] = { ...newReports[index], file };
      return newReports;
    });
  };
  
  const handleRemoveReport = (index: number) => {
    setReportFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!article.title || !article.description) {
      toast.error('Title and description are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Insert or update article
      let articleId = article.id;
      
      if (isNewArticle) {
        // Create new article - don't include slug as it's generated automatically by Supabase function
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: article.title,
            description: article.description,
            content: article.content,
            category: article.category,
            image_url: article.image_url,
            // We don't need to provide slug as our DB trigger will generate it
          })
          .select('id')
          .single();
        
        if (error) throw error;
        articleId = data.id;
      } else {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update({
            title: article.title,
            description: article.description,
            content: article.content,
            category: article.category,
            image_url: article.image_url
          })
          .eq('id', article.id);
        
        if (error) throw error;
      }
      
      // If we have an article ID, handle authors and reports
      if (articleId) {
        // First delete existing author links
        await supabase
          .from('article_authors')
          .delete()
          .eq('article_id', articleId);
        
        // Then create new author links
        if (selectedAuthorIds.length > 0) {
          const authorLinks = selectedAuthorIds.map(authorId => ({
            article_id: articleId,
            author_id: authorId
          }));
          
          const { error } = await supabase
            .from('article_authors')
            .insert(authorLinks);
          
          if (error) throw error;
        }
        
        // Handle report uploads
        for (const reportData of reportFiles) {
          if (reportData.file && reportData.file.size > 0 && reportData.title) {
            // Upload the file
            const fileExt = reportData.file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `reports/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('public')
              .upload(filePath, reportData.file, {
                contentType: reportData.file.type,
                upsert: true
              });
            
            if (uploadError) throw uploadError;
            
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('public')
              .getPublicUrl(filePath);
            
            // Create the report entry
            const { error } = await supabase
              .from('reports')
              .insert({
                title: reportData.title,
                description: reportData.description,
                file_url: publicUrl,
                article_id: articleId
              });
            
            if (error) throw error;
          }
        }
      }
      
      toast.success(isNewArticle ? 'Article created successfully' : 'Article updated successfully');
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Error saving article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isNewArticle,
    fileInputRef,
    article,
    selectedAuthorIds,
    isSubmitting,
    reportFiles,
    uploadProgress,
    authors,
    authorsLoading,
    articleLoading,
    handleInputChange,
    handleImageChange,
    handleAuthorSelection,
    handleContentChange,
    handleImageUpload,
    handleAddReport,
    handleReportChange,
    handleReportFileChange,
    handleRemoveReport,
    handleSubmit,
    navigate
  };
}

export default useArticleEditor;
