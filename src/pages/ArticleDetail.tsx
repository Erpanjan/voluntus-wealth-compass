
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, User, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useArticleDetailByLanguage } from '@/hooks/useArticleDetailByLanguage';
import { useLanguage } from '@/contexts/LanguageContext';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { article, loading, error } = useArticleDetailByLanguage(slug || '', language);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('common.error')}
            </h1>
            <p className="text-gray-600 mb-8">
              The article you're looking for could not be found or may not be available in the selected language.
            </p>
            <Link to="/insight">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    if (content && typeof content === 'object') {
      return <div dangerouslySetInnerHTML={{ __html: content.html || '' }} />;
    }
    
    return <p>No content available</p>;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link 
          to="/insight" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Insights
        </Link>

        <article className="space-y-8">
          {article.image_url && (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-lg">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h1>
              
              {article.description && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {article.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-200 pb-6">
              {article.author_name && (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{article.author_name}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              
              {article.category && (
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              {renderContent(article.content)}
            </div>

            {article.reports && article.reports.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Related Reports</h3>
                <div className="space-y-3">
                  {article.reports.map((report: any) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        {report.description && (
                          <p className="text-sm text-gray-600">{report.description}</p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(report.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
