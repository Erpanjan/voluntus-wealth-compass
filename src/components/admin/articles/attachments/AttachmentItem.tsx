
import React from 'react';
import { File, Download, X } from 'lucide-react';
import { Attachment } from '@/hooks/admin/articleEditor/useArticleAttachments';
import { formatFileSize } from './utils';

interface AttachmentItemProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <File className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{attachment.name || attachment.title}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatFileSize(attachment.size)}
            {attachment.type && <span className="ml-2">({attachment.type.split('/').pop()})</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {(attachment.file_url || attachment.url) && (
          <a 
            href={attachment.file_url || attachment.url} 
            target="_blank" 
            rel="noreferrer"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </a>
        )}
        <button 
          onClick={() => onRemove(attachment.id)}
          className="p-2 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AttachmentItem;
