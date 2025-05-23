
import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ArticleCard from '@/components/ArticleCard';
import ContactForm from '@/components/ContactForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { usePublishedArticles } from '@/hooks/usePublishedArticles';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const Insight = () => {
  const { articles, loading, totalPages, currentPage, totalCount } = usePublishedArticles(4);
  const [displayPage, setDisplayPage] = useState(1); // 1-based for UI
  
  const handlePageChange = (page: number) => {
    setDisplayPage(page);
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

  // Calculate articles to display for current page
  const articlesPerPage = 4;
  const startIndex = (displayPage - 1) * articlesPerPage;
  const displayedArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Market Insight"
        subtitle="Our insights guide us in formulating and updating Financial Planning Policies for clients, ensuring they remain consistently informed about the market and their progress."
        background="light"
      />

      {/* Latest Research Section */}
      <Section title="Latest Research" titleCentered={true}>
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
              <h3 className="text-xl font-medium text-gray-600">No articles found</h3>
              <p className="mt-2 text-gray-500">Check back soon for new insights</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && !loading && (
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
        )}

        {!loading && totalCount > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {Math.min(startIndex + 1, totalCount)} - {Math.min(startIndex + articlesPerPage, totalCount)} of {totalCount} articles
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
