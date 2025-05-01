
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticleDetail } from '@/hooks/useArticleDetail';
import { ArrowLeft, Calendar, User, FileText, Download } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AttachmentList } from '@/components/admin/articles/attachments';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error } = useArticleDetail(slug || '');
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6 min-h-screen animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-80 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Article not found</h1>
        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to="/insight">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Link>
        </Button>
      </div>
    );
  }
  
  const formattedDate = article.published_at ? 
    formatDistance(new Date(article.published_at), new Date(), { addSuffix: true }) : 
    'Unknown date';
  
  // Convert reports to attachment format if they exist
  const attachments = article.reports?.map(report => ({
    id: report.id,
    name: report.title,
    title: report.title,
    description: report.description || '',
    size: 0, // We don't have size in the reports data
    type: 'application/pdf', // Assuming PDFs for simplicity
    file_url: report.file_url,
    url: report.file_url
  })) || [];
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/insight">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Link>
        </Button>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6 flex-wrap gap-y-2">
          <div className="flex items-center mr-6">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          
          {article.category && (
            <div className="flex items-center mr-6">
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{article.category}</span>
            </div>
          )}
          
          {article.authors && article.authors.length > 0 && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {article.authors.map(author => author.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {article.image_url && (
        <div className="mb-8">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="prose max-w-none mb-12">
        {article.description && (
          <p className="text-xl text-gray-700 mb-6">{article.description}</p>
        )}
        
        {typeof article.content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <div>
            {/* Handle JSON content if needed */}
            <p>Content unavailable</p>
          </div>
        )}
      </div>
      
      {/* Reports/Attachments section */}
      {attachments && attachments.length > 0 && (
        <div className="mt-12 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2" />
            Attachments
          </h2>
          
          <div className="space-y-4">
            {attachments.map((attachment) => (
              <div 
                key={attachment.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{attachment.title}</p>
                    {attachment.description && (
                      <p className="text-sm text-gray-500">{attachment.description}</p>
                    )}
                  </div>
                </div>
                
                <Button asChild variant="outline" size="sm">
                  <a 
                    href={attachment.file_url || attachment.url} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
