
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useArticleDetail } from '@/hooks/useArticleDetail';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { article, loading, error } = useArticleDetail(id || '');

  // Handle missing article ID
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error</h1>
        <p className="mt-4">Article ID is missing. Please go back and try again.</p>
        <Button asChild className="mt-6">
          <Link to="/insight">
            <ArrowLeft size={18} className="mr-2" />
            Back to Insights
          </Link>
        </Button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        
        <Skeleton className="h-64 w-full mb-8" />
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Article Not Found</h1>
        <p className="mt-4">The article you are looking for does not exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/insight">
            <ArrowLeft size={18} className="mr-2" />
            Back to Insights
          </Link>
        </Button>
      </div>
    );
  }

  // Render content
  const renderContent = () => {
    if (typeof article.content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: article.content }} />;
    } else if (article.content && typeof article.content === 'object') {
      // For rich text content stored as JSON, we need a more sophisticated renderer
      // For now, we'll just display it as formatted text
      return <div dangerouslySetInnerHTML={{ __html: JSON.stringify(article.content) }} />;
    }
    
    return <p>{article.description}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-8 hover:bg-gray-100">
          <Link to="/insight">
            <ArrowLeft size={18} className="mr-2" />
            Back to Insights
          </Link>
        </Button>
        
        {/* Article header */}
        <div className="mb-6">
          <Badge className="mb-3">{article.category}</Badge>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar size={16} className="mr-2" />
            <span>{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
          </div>
          
          {article.authors && article.authors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-gray-600">By:</span>
              {article.authors.map((author, index) => (
                <span key={author.id} className="text-gray-900 font-medium">
                  {author.name}{index < article.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Feature image */}
        {article.image_url && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Article content */}
        <div className="prose max-w-none mb-12">
          <p className="text-xl font-medium text-gray-700 mb-6">{article.description}</p>
          <Separator className="my-6" />
          {renderContent()}
        </div>
        
        {/* Attachments section */}
        {article.reports && article.reports.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Attachments</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {article.reports.map((report) => (
                <Card key={report.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    {report.description && (
                      <p className="text-sm text-gray-600">{report.description}</p>
                    )}
                  </div>
                  <Button variant="outline" asChild>
                    <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                      <Download size={16} className="mr-2" />
                      Download
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
