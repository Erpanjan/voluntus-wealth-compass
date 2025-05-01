
import React from 'react';
import ArticleForm from '@/components/admin/articles/ArticleForm';
import ArticleStatusCard from '@/components/admin/articles/ArticleStatusCard';
import ArticlePublishingOptions from '@/components/admin/articles/ArticlePublishingOptions';

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
  loading,
  onPreview,
  onSaveDraft,
  onPublishNow
}) => {
  return (
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
          onPreview={onPreview}
          onSaveDraft={onSaveDraft}
          onPublishNow={onPublishNow}
        />
      </div>
    </div>
  );
};

export default ArticleEditorContent;
