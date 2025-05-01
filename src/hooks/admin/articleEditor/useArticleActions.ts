
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useArticleActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Navigation functions
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Save as draft function
  const saveDraft = async (formData: any, authors: string[], image: File | null, attachments: any[]) => {
    setSubmitting(true);
    
    try {
      // Log the data being submitted
      console.log("Saving draft:", {
        ...formData,
        authors,
        image: image ? "Image file present" : "No image",
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
  const publishArticle = async (formData: any, authors: string[], image: File | null, attachments: any[]) => {
    setSubmitting(true);
    
    try {
      // Log the data being submitted including authors and attachments
      console.log("Publishing article:", {
        ...formData,
        authors,
        image: image ? "Image file present" : "No image",
        attachments: attachments.length > 0 ? `${attachments.length} files attached` : "No attachments",
        status: "published"
      });
      
      // For now, just simulate a successful operation
      setTimeout(() => {
        toast({
          title: 'Article Published',
          description: `The article has been published successfully with ${authors.length} author(s) and ${attachments.length} attachment(s).`,
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
  
  return {
    submitting,
    navigateBack,
    saveDraft,
    publishArticle
  };
};
