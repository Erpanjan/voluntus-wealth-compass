
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import ArticleBasicInfo from '@/components/admin/articles/form/ArticleBasicInfo';
import ArticleMetadata from '@/components/admin/articles/form/ArticleMetadata';
import ArticleImageUpload from '@/components/admin/articles/form/ArticleImageUpload';
import ArticleContentEditor from '@/components/admin/articles/form/ArticleContentEditor';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface ArticleEditorContentProps {
  formValues: any;
  handleFormChange: (field: string, value: any) => void;
  htmlContent: string;
  setHtmlContent: (content: string) => void;
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
  loading: boolean;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublishNow: () => void;
}

const ArticleEditorContent: React.FC<ArticleEditorContentProps> = ({
  formValues,
  handleFormChange,
  htmlContent,
  setHtmlContent,
  previewUrl,
  handleImageChange,
  loading
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const form = useForm({
    defaultValues: formValues
  });

  return (
    <div className="w-full space-y-6">
      {/* Article Information Section - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <Card>
          <div className="flex items-center justify-between p-4 cursor-pointer">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="text-lg font-semibold">Article Information</h3>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? '' : 'transform rotate-180'}`} />
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <CardContent className="pb-6">
              <Form {...form}>
                <form className="space-y-6">
                  <ArticleBasicInfo form={form} formValues={formValues} onChange={handleFormChange} />
                  <ArticleMetadata form={form} formValues={formValues} onChange={handleFormChange} />
                  <ArticleImageUpload previewUrl={previewUrl} handleImageChange={handleImageChange} />
                </form>
              </Form>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Article Content Editor - Always Visible */}
      <Card>
        <CardContent className="pt-6">
          <ArticleContentEditor htmlContent={htmlContent} setHtmlContent={setHtmlContent} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleEditorContent;
