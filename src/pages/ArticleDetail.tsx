import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSimpleArticleDetail } from '@/hooks/useSimpleArticleDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw, Clock, User } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-white via-voluntus-gray-lightest to-voluntus-accent-mint">
        {/* Enhanced Loading Hero */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-voluntus-gray-dark/40 to-voluntus-gray-dark/20"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
            <div className="max-w-4xl">
              <Skeleton className="h-8 w-32 mb-6 bg-white/20" />
              <Skeleton className="h-16 w-3/4 mb-4 bg-white/30" />
              <div className="flex items-center gap-6 mb-6">
                <Skeleton className="h-4 w-24 bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/20" />
              </div>
              <Skeleton className="h-6 w-2/3 bg-white/20" />
            </div>
          </div>
        </div>
        
        {/* Content Loading */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="min-h-screen bg-gradient-to-br from-white via-voluntus-gray-lightest to-voluntus-accent-peach">
        <div className="relative h-[50vh] flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-voluntus-accent-peach flex items-center justify-center">
              <RefreshCw className="h-12 w-12 text-voluntus-gray-medium" />
            </div>
            <h1 className="text-4xl font-bold text-voluntus-text-primary mb-4">Article Not Found</h1>
            <p className="text-xl text-voluntus-text-secondary mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="px-8 py-3 border-2 border-voluntus-gray-medium hover:bg-voluntus-gray-medium hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
              <Button 
                onClick={refetch}
                className="px-8 py-3 bg-voluntus-gray-dark hover:bg-voluntus-gray-dark/90 transition-all duration-300"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
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
      return <p className="text-voluntus-text-secondary italic">No content available.</p>;
    }

    // Handle HTML string content (most common case from database)
    if (typeof content === 'string') {
      // Check if it's HTML by looking for HTML tags
      if (content.includes('<') && content.includes('>')) {
        return (
          <div 
            className="article-content prose prose-xl max-w-none 
                       prose-headings:font-poppins prose-headings:font-semibold prose-headings:text-voluntus-text-primary prose-headings:leading-tight
                       prose-p:text-voluntus-text-secondary prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                       prose-ul:mb-6 prose-ol:mb-6 prose-li:text-voluntus-text-secondary prose-li:text-lg prose-li:leading-relaxed
                       prose-a:text-voluntus-teal-dark prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                       prose-strong:text-voluntus-text-primary prose-strong:font-semibold
                       prose-blockquote:border-l-4 prose-blockquote:border-voluntus-teal prose-blockquote:bg-voluntus-accent-mint prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:text-voluntus-text-primary prose-blockquote:italic
                       prose-code:bg-voluntus-gray-light prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-voluntus-text-primary
                       prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      } else {
        // Plain text content
        return <div className="article-content prose prose-xl max-w-none whitespace-pre-wrap text-lg leading-relaxed text-voluntus-text-secondary">{content}</div>;
      }
    }

    // Handle JSON block content (for backward compatibility)
    if (typeof content === 'object') {
      if (content.blocks && Array.isArray(content.blocks)) {
        return (
          <div className="article-content prose prose-xl max-w-none">
            {content.blocks.map((block: any, index: number) => {
              switch (block.type) {
                case 'paragraph':
                  return <p key={index} className="mb-6 text-lg leading-relaxed text-voluntus-text-secondary">{block.data?.text || ''}</p>;
                case 'header':
                  const HeaderTag = `h${Math.min(block.data?.level || 2, 6)}` as keyof JSX.IntrinsicElements;
                  return <HeaderTag key={index} className="font-poppins font-semibold text-voluntus-text-primary mb-6">{block.data?.text || ''}</HeaderTag>;
                case 'list':
                  const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
                  return (
                    <ListTag key={index} className="mb-6 ml-6">
                      {block.data?.items?.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="mb-3 text-lg leading-relaxed text-voluntus-text-secondary">{item}</li>
                      ))}
                    </ListTag>
                  );
                default:
                  return <div key={index} className="mb-6 p-4 bg-voluntus-gray-light rounded-lg text-sm font-mono text-voluntus-text-primary">{JSON.stringify(block.data)}</div>;
              }
            })}
          </div>
        );
      } else {
        // Other object formats
        return <div className="article-content prose prose-xl max-w-none p-4 bg-voluntus-gray-light rounded-lg text-sm font-mono text-voluntus-text-primary">{JSON.stringify(content, null, 2)}</div>;
      }
    }

    // Fallback for unknown content types
    return <div className="article-content prose prose-xl max-w-none text-lg text-voluntus-text-secondary">{String(content)}</div>;
  };

  console.log('✅ [ArticleDetail] Successfully rendering article:', article.title);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section with Background Image */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image with Overlay */}
        {article.image_url && (
          <div className="absolute inset-0">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.warn('⚠️ [ArticleDetail] Failed to load article image:', article.image_url);
                const target = e.target as HTMLImageElement;
                target.parentElement!.style.background = 'linear-gradient(135deg, #F1F1F1 0%, #E5E5E5 100%)';
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
        )}
        
        {/* Fallback Background */}
        {!article.image_url && (
          <div className="absolute inset-0 bg-gradient-to-br from-voluntus-gray-dark via-voluntus-gray-medium to-voluntus-teal-dark"></div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-4xl">
            {/* Back Navigation */}
            <Button 
              onClick={() => window.history.back()} 
              variant="ghost" 
              className="mb-8 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Articles
            </Button>
            
            {/* Category Tag */}
            {article.category && (
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-voluntus-teal/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                  {article.category}
                </span>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-poppins">
              {article.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-lg">{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
              </div>
              {article.author_name && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-lg">By {article.author_name}</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            {article.description && (
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl font-light">
                {article.description}
              </p>
            )}
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* Article Content Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Content with Enhanced Typography */}
          <div className="bg-white">
            {renderContent(article.content)}
          </div>
        </div>
      </div>

      {/* Enhanced Related Reports Section */}
      {article.reports && article.reports.length > 0 && (
        <div className="bg-gradient-to-br from-voluntus-gray-lightest to-voluntus-accent-mint py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-voluntus-text-primary mb-4 font-poppins">
                  Related Reports
                </h2>
                <p className="text-lg text-voluntus-text-secondary">
                  Download additional resources and detailed analysis
                </p>
              </div>

              {/* Reports Grid */}
              <div className="grid gap-6">
                {article.reports.map((report) => (
                  <Card key={report.id} className="group hover:shadow-hover transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-voluntus-text-primary mb-3 group-hover:text-voluntus-teal-dark transition-colors duration-300">
                            {report.title}
                          </h3>
                          {report.description && (
                            <p className="text-voluntus-text-secondary mb-4 leading-relaxed">
                              {report.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-voluntus-text-tertiary">
                            <Clock className="h-4 w-4" />
                            <span>{format(new Date(report.created_at), 'MMMM dd, yyyy')}</span>
                          </div>
                        </div>
                        <div className="ml-8">
                          <Button 
                            asChild 
                            className="bg-voluntus-teal hover:bg-voluntus-teal-dark text-white px-6 py-3 rounded-full transition-all duration-300 group-hover:scale-105"
                          >
                            <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-5 w-5" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
