
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  triggerFileInput: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ triggerFileInput }) => {
  return (
    <Button 
      onClick={triggerFileInput}
      variant="outline"
      className="w-full border-dashed border-2 p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
    >
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      <div className="text-center">
        <p className="font-medium text-gray-700">Click to upload files</p>
        <p className="text-sm text-gray-500 mt-1">PDF, Word, Excel, PowerPoint, Text files</p>
      </div>
    </Button>
  );
};

export default FileUploadArea;
