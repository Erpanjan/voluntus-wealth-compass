
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Save, Send } from 'lucide-react';

interface ArticleHeaderProps {
  isEditMode: boolean;
  navigate: NavigateFunction;
  handlePreview: () => void;
  handleSaveDraft: () => void;
  handlePublishNow: () => void;
  submitting: boolean;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  isEditMode,
  navigate,
  handlePreview,
  handleSaveDraft,
  handlePublishNow,
  submitting
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/articles')}
          className="mr-2"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Articles
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={handlePreview}
          disabled={submitting}
        >
          <Eye size={16} className="mr-2" />
          Preview
        </Button>
        <Button 
          variant="outline"
          onClick={handleSaveDraft}
          disabled={submitting}
        >
          <Save size={16} className="mr-2" />
          {submitting ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button 
          onClick={handlePublishNow}
          disabled={submitting}
        >
          <Send size={16} className="mr-2" />
          {submitting ? 'Publishing...' : 'Publish Now'}
        </Button>
      </div>
    </div>
  );
};

export default ArticleHeader;
