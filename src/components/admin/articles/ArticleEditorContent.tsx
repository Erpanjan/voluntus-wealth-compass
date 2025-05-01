
import React from 'react';
import ArticleForm from '@/components/admin/articles/ArticleForm';

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
    <div className="w-full">
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
  );
};

export default ArticleEditorContent;
