
import React, { useState, useCallback, useMemo } from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { useSimplePublishedArticles } from '@/hooks/useSimplePublishedArticles';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

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
  } = useSimplePublishedArticles(6, language);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  // Editorial article cards
  const articleCards = useMemo(() => {
    return articles.map((article, index) => (
      <article key={article.id} className="group">
        {/* Large featured image */}
        <Link to={`/insight/${article.slug}`} className="block editorial-spacing">
          <img 
            src={article.image_url || `https://images.unsplash.com/photo-${1488590528505 + index}?auto=format&fit=crop&q=80&w=800&h=600`}
            alt={article.title}
            className="editorial-image w-full h-[400px] md:h-[500px] object-cover group-hover:opacity-90 transition-opacity duration-300"
            loading={index < 2 ? "eager" : "lazy"}
          />
        </Link>
        
        {/* Editorial content */}
        <div className="text-center">
          <Link to={`/insight/${article.slug}`}>
            <h3 className="text-xl md:text-2xl font-normal tracking-wide text-black mb-4 leading-tight group-hover:opacity-70 transition-opacity duration-200">
              {article.title}
            </h3>
          </Link>
          {article.description && (
            <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed mb-6 max-w-xl mx-auto">
              {article.description}
            </p>
          )}
          
          {/* Minimal metadata */}
          <div className="text-xs text-gray-400 uppercase tracking-widest">
            {format(new Date(article.published_at), 'MMMM yyyy')}
            {article.authors && article.authors.length > 0 && (
              <span> • {article.authors[0].name}</span>
            )}
          </div>
        </div>
      </article>
    ));
  }, [articles]);

  // Loading skeletons
  const renderSkeletons = useMemo(() => (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-6">
          <Skeleton className="h-[400px] w-full" />
          <div className="text-center space-y-3">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
            <Skeleton className="h-3 w-1/3 mx-auto" />
          </div>
        </div>
      ))}
    </>
  ), []);

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-minimal Hero */}
      <Hero 
        title={t('insight.title')}
        subtitle={t('insight.subtitle')}
        background="white"
      />

      {/* Editorial Articles Grid */}
      <Section background="white" className="py-32">
        <div className="w-full">
          {/* Section title */}
          <div className="editorial-spacing-large text-center">
            <h2 className="font-light tracking-wide leading-tight">
              {t('insight.latestResearch')}
            </h2>
          </div>
          
          {/* Articles grid - editorial style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 max-w-6xl mx-auto">
            {loading ? renderSkeletons : articleCards}
            
            {!loading && articles.length === 0 && (
              <div className="col-span-full text-center py-32">
                <h3 className="text-xl font-light text-gray-600 mb-4">{t('insight.noArticles')}</h3>
                <p className="text-sm font-light text-gray-500">{t('insight.noArticles.subtitle')}</p>
              </div>
            )}
          </div>
          
          {/* Minimal pagination */}
          {totalPages > 1 && !loading && (
            <div className="text-center mt-24">
              <div className="inline-flex space-x-8">
                {currentPage > 0 && (
                  <button 
                    onClick={() => handlePageChange(currentPage)}
                    className="text-xs uppercase tracking-widest text-black hover:opacity-70 transition-opacity duration-200"
                  >
                    Previous
                  </button>
                )}
                <span className="text-xs text-gray-400 uppercase tracking-widest">
                  {currentPage + 1} of {totalPages}
                </span>
                {currentPage + 1 < totalPages && (
                  <button 
                    onClick={() => handlePageChange(currentPage + 2)}
                    className="text-xs uppercase tracking-widest text-black hover:opacity-70 transition-opacity duration-200"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Minimal Contact */}
      <Section background="white" className="py-32">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Insight;
