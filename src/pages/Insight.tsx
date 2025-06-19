import React, { useState, useCallback, useMemo } from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ArticleCard from '@/components/ArticleCard';
import WaitlistForm from '@/components/WaitlistForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useSimplePublishedArticles } from '@/hooks/useSimplePublishedArticles';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

const Insight = () => {
  const { t, language } = useLanguage();
  const { 
    articles, 
    loading, 
    totalPages, 
    totalCount, 
    currentPage,
    setCurrentPage,
    refresh 
  } = useSimplePublishedArticles(4, language);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1); // Convert to 0-based for backend
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing articles...');
    refresh();
  }, [refresh]);

  // Memoized skeleton renderer
  const renderSkeletons = useMemo(() => (
    <>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </>
  ), []);

  // Memoized article cards
  const articleCards = useMemo(() => {
    console.log('Rendering article cards:', { 
      articlesCount: articles.length, 
      language,
      articles: articles.map(a => ({ id: a.id, title: a.title, hasContent: !!a.content }))
    });
    
    return articles.map((article, index) => (
      <ArticleCard
        key={article.id}
        id={article.slug}
        title={article.title}
        date={format(new Date(article.published_at), 'MMMM dd, yyyy')}
        description={article.description}
        category={article.category}
        authors={article.authors?.map(author => author.name) || []}
        image={article.image_url}
        priority={index < 2}
      />
    ));
  }, [articles, language]);

  // Memoized pagination
  const paginationComponent = useMemo(() => {
    if (totalPages <= 1 || loading) return null;

    const displayPage = currentPage + 1;

    return (
      <div className="mt-12">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (displayPage > 1) handlePageChange(displayPage - 1);
                }}
                className={displayPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink 
                  href="#" 
                  isActive={displayPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (displayPage < totalPages) handlePageChange(displayPage + 1);
                }}
                className={displayPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }, [totalPages, loading, currentPage, handlePageChange]);

  // Memoized article stats
  const articleStats = useMemo(() => {
    if (loading || totalCount === 0) return null;

    const startIndex = currentPage * 4;
    return (
      <div className="mt-8 text-center text-sm text-brand-gray">
        {t('insight.showing')} {Math.min(startIndex + 1, totalCount)} - {Math.min(startIndex + 4, totalCount)} {t('insight.of')} {totalCount} {t('insight.articles')}
      </div>
    );
  }, [loading, totalCount, currentPage, t]);

  console.log('Insight page render:', { 
    articles: articles.length, 
    loading, 
    totalCount, 
    totalPages,
    currentPage: currentPage + 1,
    language,
    hasArticles: articles.length > 0,
    isDataReady: !loading && articles.length >= 0
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('insight.title')}
        subtitle={t('insight.subtitle')}
        background="brand-primary"
      />

      {/* Latest Research Section */}
      <Section title={t('insight.latestResearch')} titleCentered={true} background="white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full">
          {loading ? renderSkeletons : articleCards}
          
          {!loading && articles.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-medium text-brand-gray">{t('insight.noArticles')}</h3>
              <p className="mt-2 text-brand-gray">{t('insight.noArticles.subtitle')}</p>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="mt-4"
              >
                <RefreshCw size={16} className="mr-2" />
                {t('insight.refresh')}
              </Button>
              <div className="mt-4 text-sm text-brand-gray">
                Debug: Language={language}, Total Count={totalCount}, Loading={loading ? 'true' : 'false'}
              </div>
            </div>
          )}
        </div>
        
        {paginationComponent}
        {articleStats}
      </Section>

      {/* Waitlist Form Section */}
      <Section id="contact" background="brand-secondary">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Insight;
