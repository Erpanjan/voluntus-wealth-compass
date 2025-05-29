
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
    <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-3 hover:bg-gray-100"
          size="sm"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Articles
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Article' : 'Create Article'}
          </h1>
          <p className="text-sm text-gray-600">
            {isEditMode ? 'Update your multilingual article content' : 'Create a new multilingual article'}
          </p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={onPreview}
          variant="outline"
          disabled={submitting}
          className="hover:bg-gray-50"
          size="sm"
        >
          <Eye size={16} className="mr-2" />
          Preview
        </Button>
        
        <Button 
          onClick={onSaveDraft}
          variant="secondary"
          disabled={submitting}
          size="sm"
        >
          <Save size={16} className="mr-2" />
          {submitting ? 'Saving...' : isEditMode ? 'Update Draft' : 'Save Draft'}
        </Button>
        
        <Button 
          onClick={onPublish}
          disabled={submitting}
          size="sm"
        >
          <Send size={16} className="mr-2" />
          {submitting ? 'Publishing...' : isEditMode ? 'Update & Publish' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};

export default ArticleEditorToolbar;
