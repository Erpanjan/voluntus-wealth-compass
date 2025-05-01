
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { handleImageUpload, clearImageUpload } from '@/utils/imageUtils';

// Sample data for edit mode - would normally come from the database
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

// Sample attachments for edit mode
const SAMPLE_ATTACHMENTS = [
  {
    id: 'attachment-1',
    name: 'Financial Planning Guide.pdf',
    size: 2500000, // 2.5MB
    type: 'application/pdf',
    url: 'https://example.com/files/financial-planning-guide.pdf'
  },
  {
    id: 'attachment-2',
    name: 'Investment Strategies.pdf',
    size: 1800000, // 1.8MB
    type: 'application/pdf',
    url: 'https://example.com/files/investment-strategies.pdf'
  }
];

export const useArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
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
  
  // Load article data if in edit mode
  const loadArticleData = async () => {
    if (!isEditMode) return;
    
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
        
        // Load sample attachments
        setAttachments(SAMPLE_ATTACHMENTS);
        
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
        attachments: attachments.length > 0 ? `${attachments.length} files attached` : "No attachments",
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
      
      // Log the data being submitted including authors and attachments
      console.log("Publishing article:", {
        ...formData,
        authors: selectedAuthors,
        image: imageFile ? "Image file present" : "No image",
        attachments: attachments.length > 0 ? `${attachments.length} files attached` : "No attachments",
        status: "published"
      });
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: 'Article Published',
          description: `The article has been published successfully with ${selectedAuthors.length} author(s) and ${attachments.length} attachment(s).`,
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

  // Navigation functions
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Preview function
  const openPreview = () => {
    setPreviewOpen(true);
  };

  return {
    form,
    isEditMode,
    submitting,
    selectedAuthors,
    setSelectedAuthors,
    imagePreview,
    setImagePreview,
    imageFile,
    setImageFile,
    fileInputRef,
    previewOpen,
    setPreviewOpen,
    attachments,
    setAttachments,
    loadArticleData,
    saveDraft,
    publishArticle,
    handleImageChange,
    handleRemoveImage,
    navigateBack,
    openPreview
  };
};
