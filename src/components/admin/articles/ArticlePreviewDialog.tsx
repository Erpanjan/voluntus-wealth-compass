
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ArticlePreviewDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  content: string;
  imagePreview: string | null;
  category: string;
  authors: string[];
}

const ArticlePreviewDialog: React.FC<ArticlePreviewDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  content,
  imagePreview,
  category,
  authors
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Article Preview</DialogTitle>
          <DialogDescription>Preview how your article will appear when published</DialogDescription>
        </DialogHeader>
        <div className="preview-container">
          <h1 className="text-3xl font-bold mb-4">{title || 'Untitled Article'}</h1>
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt={title} className="w-full h-64 object-cover rounded-lg" />
            </div>
          )}
          <div className="text-gray-500 mb-2 flex gap-2 items-center">
            <span>By: {authors.join(', ') || 'Unknown Author'}</span>
            <span>•</span>
            <span>Category: {category || 'Uncategorized'}</span>
          </div>
          <p className="text-gray-700 mb-6 italic">{description || 'No description provided.'}</p>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticlePreviewDialog;
