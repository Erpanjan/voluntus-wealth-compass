
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { usePublishedArticlesByLanguage } from '@/hooks/usePublishedArticlesByLanguage';
import { useLanguage } from '@/contexts/LanguageContext';

const Insight = () => {
  const { language, t } = useLanguage();
  const { 
    articles, 
    loading, 
    hasMore, 
    totalCount,
    currentPage,
    loadMore, 
    refresh 
  } = usePublishedArticlesByLanguage(4, language);

  const showingCount = Math.min((currentPage + 1) * 4, totalCount);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6">
            {t('insight.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('insight.subtitle')}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t('insight.latestResearch')}
            </h2>
            <Button 
              onClick={refresh}
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('insight.refresh')}
            </Button>
          </div>

          {loading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-600 text-sm">
                  {t('insight.showing')} {showingCount} {t('insight.of')} {totalCount} {t('insight.articles')}
                </p>
                
                {hasMore && (
                  <Button 
                    onClick={loadMore}
                    variant="outline"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? t('common.loading') : t('common.learnMore')}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('insight.noArticles')}
              </h3>
              <p className="text-gray-600">
                {t('insight.noArticles.subtitle')}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insight;
