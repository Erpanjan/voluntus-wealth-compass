
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useArticleDetail } from '@/hooks/useArticleDetail';
import { ArrowLeft, Calendar, User, FileText, Download, File } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { getFileExtension } from '@/components/admin/articles/attachments/utils';
import { useToast } from '@/hooks/use-toast';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error, refetch } = useArticleDetail(slug || '');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log article data for debugging
    if (article) {
      console.log("Article data loaded successfully:", article);
      console.log("Article content type:", typeof article.content);
      console.log("Article content:", article.content);
      
      if (article.reports && article.reports.length > 0) {
        console.log("Article has attachments:", article.reports.length);
        console.log("Reports data:", article.reports);
      } else {
        console.log("Article has no attachments");
      }
    }
  }, [article]);

  useEffect(() => {
    // Handle error with toast and logging
    if (error) {
      console.error("Error loading article:", error);
      toast({
        title: "Error loading article",
        description: "There was a problem loading the article. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    // Auto-retry loading once if there's an error
    if (error) {
      const timer = setTimeout(() => {
        console.log("Attempting to refetch article data...");
        refetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, refetch]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6 min-h-[50vh]">
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>
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
  const hasAttachments = article.reports && article.reports.length > 0;
  
  // Get icon based on file extension
  const getFileIcon = (fileUrl: string) => {
    const extension = getFileExtension(fileUrl);
    
    switch(extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Extract file name from URL
  const getFileName = (fileUrl: string) => {
    try {
      const urlParts = fileUrl.split('/');
      const rawName = urlParts[urlParts.length - 1];
      
      // URL decode the filename
      const decodedName = decodeURIComponent(rawName);
      
      // Remove UUID prefix if present (assuming format: uuid-filename.ext)
      const parts = decodedName.split('-');
      if (parts.length > 1 && parts[0].length === 36) {
        return parts.slice(1).join('-');
      }
      
      return decodedName;
    } catch (error) {
      console.error("Error extracting filename from URL:", error);
      return "Download File";
    }
  };

  // Handle attachment download with error handling
  const handleDownload = (attachment: any) => {
    try {
      // Log the download attempt
      console.log("Attempting to download:", attachment.file_url);
      
      // Open in new tab instead of direct download to handle potential errors
      window.open(attachment.file_url, '_blank');
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast({
        title: "Download Error",
        description: "Could not download the file. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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
            onError={(e) => {
              console.error("Error loading image:", article.image_url);
              e.currentTarget.style.display = 'none';
            }}
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
            {/* For JSON content, stringify and format it */}
            {article.content && typeof article.content === 'object' ? (
              <div dangerouslySetInnerHTML={{ __html: JSON.stringify(article.content) }} />
            ) : (
              <p>Content unavailable</p>
            )}
          </div>
        )}
      </div>
      
      {/* Reports/Attachments section */}
      {hasAttachments && (
        <div className="mt-12 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2" />
            Attachments
          </h2>
          
          <div className="space-y-4">
            {article.reports.map((attachment) => (
              <div 
                key={attachment.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {getFileIcon(attachment.file_url || "")}
                  </div>
                  <div>
                    <p className="font-medium">{attachment.title || "Unnamed attachment"}</p>
                    {attachment.description && (
                      <p className="text-sm text-gray-500">{attachment.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {getFileName(attachment.file_url || "")}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleDownload(attachment)}
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Debug section - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 border border-gray-200 rounded-md">
          <h3 className="text-sm font-bold mb-2">Debug Information</h3>
          <button 
            onClick={() => refetch()} 
            className="text-xs bg-gray-100 px-2 py-1 rounded mb-2"
          >
            Refresh Data
          </button>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify({
              slug,
              hasAttachments,
              contentType: typeof article.content,
              reports: article.reports,
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
