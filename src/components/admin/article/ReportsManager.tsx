
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Upload } from 'lucide-react';

interface ReportFile {
  file: File;
  title: string;
  description: string;
}

interface ReportsManagerProps {
  reports: ReportFile[];
  onAddReport: () => void;
  onRemoveReport: (index: number) => void;
  onReportChange: (index: number, field: string, value: any) => void;
  onReportFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReportsManager: React.FC<ReportsManagerProps> = ({
  reports,
  onAddReport,
  onRemoveReport,
  onReportChange,
  onReportFileChange
}) => {
  return (
    <div className="space-y-4 border rounded-md p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Reports</h3>
        <Button
          type="button"
          variant="outline"
          onClick={onAddReport}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Report
        </Button>
      </div>
      
      {reports.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">No reports added</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="border rounded-md p-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onRemoveReport(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`report-title-${index}`}>Report Title</Label>
                  <Input
                    id={`report-title-${index}`}
                    value={report.title}
                    onChange={(e) => onReportChange(index, 'title', e.target.value)}
                    placeholder="Enter report title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`report-desc-${index}`}>Description (Optional)</Label>
                  <Input
                    id={`report-desc-${index}`}
                    value={report.description}
                    onChange={(e) => onReportChange(index, 'description', e.target.value)}
                    placeholder="Enter report description"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`report-file-${index}`}>Report File</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf,.docx,.xlsx,.pptx';
                        input.onchange = (e) => onReportFileChange(index, e as any);
                        input.click();
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Select File
                    </Button>
                    <span className="text-sm">
                      {report.file.name || 'No file selected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsManager;
