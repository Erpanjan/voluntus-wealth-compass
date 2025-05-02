
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportOptionsProps {
  handleExport: (includeNotes: boolean) => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ handleExport }) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleExport(false)}
      >
        <Download size={16} />
        Export Basic Data
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleExport(true)}
      >
        <Download size={16} />
        Export with Notes
      </Button>
    </div>
  );
};

export default ExportOptions;
