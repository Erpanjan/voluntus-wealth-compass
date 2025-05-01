import React from 'react';
import { 
  Form,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';

import ArticleBasicInfo from './form/ArticleBasicInfo';
import ArticleMetadata from './form/ArticleMetadata';
import ArticleImageUpload from './form/ArticleImageUpload';
import ArticleContentEditor from './form/ArticleContentEditor';

interface ArticleFormProps {
  formValues: {
    title: string;
    description: string;
    category: string;
    author: string;
    image_url: string;
    published_at: string;
  };
  onChange: (field: string, value: any) => void;
  htmlContent: string;
  setHtmlContent: (content: string) => void;
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
  loading: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  formValues,
  onChange,
  htmlContent,
  setHtmlContent,
  previewUrl,
  handleImageChange,
  loading
}) => {
  // This is just to keep compatibility with the form element
  const form = useForm({
    defaultValues: formValues
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
        <CardDescription>
          Edit your article content and metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <ArticleBasicInfo 
              form={form} 
              formValues={formValues} 
              onChange={onChange} 
            />
            
            <ArticleMetadata 
              form={form} 
              formValues={formValues} 
              onChange={onChange} 
            />
            
            <ArticleImageUpload 
              previewUrl={previewUrl} 
              handleImageChange={handleImageChange} 
            />
            
            <ArticleContentEditor 
              htmlContent={htmlContent} 
              setHtmlContent={setHtmlContent} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ArticleForm;
