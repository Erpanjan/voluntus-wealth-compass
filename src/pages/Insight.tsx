
import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ArticleCard from '@/components/ArticleCard';
import ContactForm from '@/components/ContactForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { usePublishedArticles } from '@/hooks/usePublishedArticles';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

const Insight = () => {
  const { articles, loading } = usePublishedArticles();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;
  const { t } = useLanguage();
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(articles.length / articlesPerPage));
  const startIndex = (currentPage - 1) * articlesPerPage;
  const displayedArticles = articles.slice(startIndex, startIndex + articlesPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render loading skeletons
  const renderSkeletons = () => (
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
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        titleKey="hero_title"
        subtitleKey="hero_subtitle"
        section="insight"
        background="light"
      />

      {/* Latest Research Section */}
      <Section titleKey="latest_research" section="insight" titleCentered={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full">
          {loading ? renderSkeletons() : (
            displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.slug}
                title={article.title}
                date={format(new Date(article.published_at), 'MMMM dd, yyyy')}
                description={article.description}
                category={article.category}
                authors={article.authors?.map(author => author.name) || []}
                image={article.image_url}
              />
            ))
          )}
          
          {!loading && articles.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-medium text-gray-600">{t('no_articles', 'insight')}</h3>
              <p className="mt-2 text-gray-500">{t('check_back', 'insight')}</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === i + 1}
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
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Section>

      {/* Contact Form */}
      <Section id="contact" background="light">
        <ContactForm />
      </Section>
    </div>
  );
};

export default Insight;
