
import { useState } from 'react';

// Sample attachments for edit mode
const SAMPLE_ATTACHMENTS = [
  {
    id: 'attachment-1',
    name: 'Financial Planning Guide.pdf',
    size: 2500000, // 2.5MB
    type: 'application/pdf',
    url: 'https://example.com/files/financial-planning-guide.pdf'
  },
  {
    id: 'attachment-2',
    name: 'Investment Strategies.pdf',
    size: 1800000, // 1.8MB
    type: 'application/pdf',
    url: 'https://example.com/files/investment-strategies.pdf'
  }
];

export const useArticleAttachments = (isEditMode: boolean) => {
  const [attachments, setAttachments] = useState<any[]>([]);
  
  const loadAttachmentsData = async () => {
    if (isEditMode) {
      // Load sample attachments for edit mode
      setAttachments(SAMPLE_ATTACHMENTS);
    }
  };
  
  return {
    attachments,
    setAttachments,
    loadAttachmentsData
  };
};
