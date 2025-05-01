
import { useState } from 'react';
import { format } from 'date-fns';

export interface ArticleFormValues {
  title: string;
  description: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
}

export const useArticleForm = (initialValues?: Partial<ArticleFormValues>) => {
  const defaultFormValues = {
    title: '',
    description: '',
    category: '',
    author: '',
    image_url: '',
    published_at: format(new Date(), 'yyyy-MM-dd'),
  };
  
  const [formValues, setFormValues] = useState<ArticleFormValues>({
    ...defaultFormValues,
    ...initialValues
  });

  const [htmlContent, setHtmlContent] = useState('');
  
  const handleFormChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formValues,
    htmlContent,
    setHtmlContent,
    handleFormChange,
    setFormValues
  };
};
