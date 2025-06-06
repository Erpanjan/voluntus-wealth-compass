
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSimpleArticleDetail } from '@/hooks/useSimpleArticleDetail';
import { useDynamicMetaTags } from '@/hooks/useDynamicMetaTags';
import { useLanguage } from '@/contexts/LanguageContext';
import ArticleDetailNavigation from '@/components/article-detail/ArticleDetailNavigation';
import ArticleDetailImage from '@/components/article-detail/ArticleDetailImage';
import ArticleDetailHeader from '@/components/article-detail/ArticleDetailHeader';
import ArticleDetailContent from '@/components/article-detail/ArticleDetailContent';
import ArticleDetailReports from '@/components/article-detail/ArticleDetailReports';
import ArticleDetailLoading from '@/components/article-detail/ArticleDetailLoading';
import ArticleDetailError from '@/components/article-detail/ArticleDetailError';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { article, loading, error, refetch } = useSimpleArticleDetail(slug || '', language);

  // Dynamic meta tags for social media sharing
  useDynamicMetaTags({
    title: article?.title,
    description: undefined, // No description for articles as requested
    image: article?.image_url || '/lovable-uploads/381e43eb-0108-4ca1-9195-758748a7bfc8.png',
    type: 'article'
  });

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
    return <ArticleDetailLoading />;
  }

  if (error || !article) {
    console.error('❌ [ArticleDetail] Error or no article found:', { error, article });
    return <ArticleDetailError onRefresh={refetch} />;
  }

  console.log('✅ [ArticleDetail] Successfully rendering article:', article.title);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Navigation Section - positioned below fixed header */}
        <div className="pt-28 pb-8">
          <ArticleDetailNavigation />
        </div>

        {/* Featured Image Section */}
        {article.image_url && (
          <div className="mb-12">
            <ArticleDetailImage imageUrl={article.image_url} title={article.title} />
          </div>
        )}

        {/* Article Information Section - below image */}
        <div className="mb-12">
          <ArticleDetailHeader article={article} />
        </div>

        {/* Content Section */}
        <div className="mb-12">
          <ArticleDetailContent content={article.content} />
        </div>

        {/* Reports Section */}
        <ArticleDetailReports reports={article.reports || []} />

        {/* Bottom Navigation - Back to Articles */}
        <div className="mt-16 pb-16 border-t border-gray-200 pt-8">
          <ArticleDetailNavigation />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
