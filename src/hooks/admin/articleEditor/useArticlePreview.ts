
import { useState } from 'react';

export const useArticlePreview = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const openPreview = () => {
    setPreviewOpen(true);
  };
  
  return {
    previewOpen,
    setPreviewOpen,
    openPreview
  };
};
