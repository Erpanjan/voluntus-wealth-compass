
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';

interface ArticleEditorToolbarProps {
  isEditMode: boolean;
  submitting: boolean;
  onBack: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const ArticleEditorToolbar: React.FC<ArticleEditorToolbarProps> = ({
  isEditMode,
  submitting,
  onBack,
  onPreview,
  onSaveDraft,
  onPublish
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={onPreview}
          variant="outline"
          disabled={submitting}
        >
          <Eye size={16} className="mr-2" />
          Preview
        </Button>
        
        <Button 
          onClick={onSaveDraft}
          variant="secondary"
          disabled={submitting}
        >
          <Save size={16} className="mr-2" />
          {submitting ? 'Saving...' : 'Save Draft'}
        </Button>
        
        <Button 
          onClick={onPublish}
          disabled={submitting}
        >
          <Send size={16} className="mr-2" />
          {submitting ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};

export default ArticleEditorToolbar;
