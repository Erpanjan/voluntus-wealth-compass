
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSimpleArticleDetail } from '@/hooks/useSimpleArticleDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw, Clock, User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { article, loading, error, refetch } = useSimpleArticleDetail(slug || '', language);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  console.log('🔍 [ArticleDetail] Current params:', { slug, language });
  console.log('🔍 [ArticleDetail] Article data:', article);

  if (!slug) {
    console.warn('⚠️ [ArticleDetail] No slug provided, redirecting to insight page');
    return <Navigate to="/insight" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Loading Header */}
          <div className="mb-8">
            <Skeleton className="h-6 w-24 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="flex items-center gap-6 mb-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          
          {/* Loading Image */}
          <Skeleton className="h-80 w-full mb-8 rounded-lg" />
          
          {/* Loading Content */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    console.error('❌ [ArticleDetail] Error or no article found:', { error, article });
    return (
      <div className="min-h-screen bg-white">
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
                onClick={refetch}
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
  }

  // Enhanced content rendering that handles both HTML strings and JSON blocks
  const renderContent = (content: any) => {
    console.log('🔍 [ArticleDetail] Rendering content:', { content, type: typeof content });

    if (!content) {
      return <p className="text-gray-600 italic">No content available.</p>;
    }

    // Handle HTML string content (most common case from database)
    if (typeof content === 'string') {
      // Check if it's HTML by looking for HTML tags
      if (content.includes('<') && content.includes('>')) {
        return (
          <div 
            className="article-content prose prose-lg max-w-none 
                       prose-headings:font-poppins prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:leading-tight
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                       prose-ul:mb-6 prose-ol:mb-6 prose-li:text-gray-700 prose-li:leading-relaxed
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r prose-blockquote:text-gray-800 prose-blockquote:italic
                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-800
                       prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      } else {
        // Plain text content
        return <div className="article-content prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">{content}</div>;
      }
    }

    // Handle JSON block content (for backward compatibility)
    if (typeof content === 'object') {
      if (content.blocks && Array.isArray(content.blocks)) {
        return (
          <div className="article-content prose prose-lg max-w-none">
            {content.blocks.map((block: any, index: number) => {
              switch (block.type) {
                case 'paragraph':
                  return <p key={index} className="mb-6 leading-relaxed text-gray-700">{block.data?.text || ''}</p>;
                case 'header':
                  const HeaderTag = `h${Math.min(block.data?.level || 2, 6)}` as keyof JSX.IntrinsicElements;
                  return <HeaderTag key={index} className="font-poppins font-semibold text-gray-900 mb-4">{block.data?.text || ''}</HeaderTag>;
                case 'list':
                  const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
                  return (
                    <ListTag key={index} className="mb-6 ml-6">
                      {block.data?.items?.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="mb-2 leading-relaxed text-gray-700">{item}</li>
                      ))}
                    </ListTag>
                  );
                default:
                  return <div key={index} className="mb-6 p-4 bg-gray-50 rounded text-sm font-mono text-gray-600">{JSON.stringify(block.data)}</div>;
              }
            })}
          </div>
        );
      } else {
        // Other object formats
        return <div className="article-content prose prose-lg max-w-none p-4 bg-gray-50 rounded text-sm font-mono text-gray-600">{JSON.stringify(content, null, 2)}</div>;
      }
    }

    // Fallback for unknown content types
    return <div className="article-content prose prose-lg max-w-none text-gray-700">{String(content)}</div>;
  };

  console.log('✅ [ArticleDetail] Successfully rendering article:', article.title);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        
        {/* Clean Header Section */}
        <header className="mb-8">
          {/* Back Navigation */}
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost" 
            className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-900 font-normal"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-poppins">
            {article.title}
          </h1>
          
          {/* Metadata with Category, Date, and Author */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
            </div>
            {article.author_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {article.author_name}</span>
              </div>
            )}
            {article.category && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {article.category}
                </span>
              </div>
            )}
          </div>
          
          {/* Description */}
          {article.description && (
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {article.description}
            </p>
          )}
        </header>

        {/* Featured Image Section */}
        {article.image_url && (
          <div className="mb-8">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  console.warn('⚠️ [ArticleDetail] Failed to load article image:', article.image_url);
                  const target = e.target as HTMLImageElement;
                  target.parentElement!.style.background = '#F3F4F6';
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Article Content Section */}
        <article className="mb-12">
          {renderContent(article.content)}
        </article>

        {/* Related Reports Section */}
        {article.reports && article.reports.length > 0 && (
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
              {article.reports.map((report) => (
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
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
