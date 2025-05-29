
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSimpleArticleDetail } from '@/hooks/useSimpleArticleDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { article, loading, error, refetch } = useSimpleArticleDetail(slug || '', language);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) {
    return <Navigate to="/insight" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
        <Section>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Section>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <Hero 
          title="Article Not Found"
          subtitle="The article you're looking for doesn't exist or has been removed."
          background="light"
        />
        <Section>
          <div className="text-center">
            <Button onClick={() => window.history.back()} variant="outline" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  // Process content for rendering
  const renderContent = (content: any) => {
    if (!content || typeof content !== 'object') {
      return <p>No content available.</p>;
    }

    // Handle different content structures
    if (content.blocks && Array.isArray(content.blocks)) {
      return content.blocks.map((block: any, index: number) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index} className="mb-4">{block.data?.text || ''}</p>;
          case 'header':
            const HeaderTag = `h${Math.min(block.data?.level || 2, 6)}` as keyof JSX.IntrinsicElements;
            return <HeaderTag key={index} className="font-bold mb-4">{block.data?.text || ''}</HeaderTag>;
          case 'list':
            const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="mb-4 ml-6">
                {block.data?.items?.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="mb-2">{item}</li>
                ))}
              </ListTag>
            );
          default:
            return <div key={index} className="mb-4">{JSON.stringify(block.data)}</div>;
        }
      });
    }

    // Fallback for simple content
    return <div className="prose max-w-none">{JSON.stringify(content)}</div>;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Article Info */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => window.history.back()} 
              variant="ghost" 
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
            
            {article.category && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                {article.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              <span>{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
              {article.author_name && (
                <>
                  <span>•</span>
                  <span>By {article.author_name}</span>
                </>
              )}
            </div>
            
            {article.description && (
              <p className="text-xl text-gray-700 leading-relaxed">
                {article.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Article Image */}
      {article.image_url && (
        <Section>
          <div className="max-w-4xl mx-auto">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        </Section>
      )}

      {/* Article Content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {renderContent(article.content)}
          </div>
        </div>
      </Section>

      {/* Reports Section */}
      {article.reports && article.reports.length > 0 && (
        <Section title="Related Reports" background="light">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {article.reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        {report.description && (
                          <p className="text-gray-600 mt-2">{report.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {format(new Date(report.created_at), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      <Button asChild>
                        <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};

export default ArticleDetail;
