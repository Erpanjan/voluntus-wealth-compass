
import React from 'react';
import { Attachment } from '@/hooks/admin/articleEditor/useArticleAttachments';
import AttachmentItem from './AttachmentItem';

interface AttachmentListProps {
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
}

const AttachmentList: React.FC<AttachmentListProps> = ({ 
  attachments, 
  onRemoveAttachment
}) => {
  if (attachments.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-medium text-gray-700">Uploaded Files ({attachments.length})</h3>
      <div className="rounded-md border divide-y">
        {attachments.map((attachment) => (
          <AttachmentItem 
            key={attachment.id} 
            attachment={attachment}
            onRemove={onRemoveAttachment}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentList;
