
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Clock } from 'lucide-react';
import { Report } from '@/types/multilingual-article.types';

interface ArticleDetailReportsProps {
  reports: Report[];
}

const ArticleDetailReports: React.FC<ArticleDetailReportsProps> = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <section className="border-t pt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-poppins">
          Related Reports
        </h2>
        <p className="text-gray-600">
          Download additional resources and detailed analysis
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {report.title}
                  </h3>
                  {report.description && (
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {report.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(report.created_at), 'MMMM dd, yyyy')}</span>
                  </div>
                </div>
                <div className="ml-6">
                  <Button 
                    asChild 
                    className="px-6"
                  >
                    <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ArticleDetailReports;
