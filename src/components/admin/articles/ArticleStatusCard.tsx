
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleStatusCardProps {
  publishDate: string;
  setPublishDate: (date: string) => void;
}

const ArticleStatusCard: React.FC<ArticleStatusCardProps> = ({
  publishDate,
  setPublishDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Status</CardTitle>
        <CardDescription>
          Control when your article is published
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <div className="text-sm">
              {publishDate && (
                <>
                  Will be published on:{' '}
                  <span className="font-medium">
                    {format(new Date(publishDate), 'MMMM d, yyyy')}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <div className="text-sm">
              {new Date(publishDate) > new Date() ? (
                <span className="text-yellow-600">Scheduled</span>
              ) : (
                <span className="text-green-600">Ready to publish</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => {
            setPublishDate(format(new Date(), 'yyyy-MM-dd'));
          }}
        >
          Set Publish Date to Today
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleStatusCard;
