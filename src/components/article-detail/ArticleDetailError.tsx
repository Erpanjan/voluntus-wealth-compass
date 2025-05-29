
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface ArticleDetailErrorProps {
  onRefresh: () => void;
}

const ArticleDetailError: React.FC<ArticleDetailErrorProps> = ({ onRefresh }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={onRefresh}
              className="px-6"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailError;
