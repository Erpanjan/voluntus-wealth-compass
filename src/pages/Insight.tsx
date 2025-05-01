
import React, { useState, useEffect } from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ArticleCard from '@/components/ArticleCard';
import ContactForm from '@/components/ContactForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';

interface Author {
  id: string;
  name: string;
  image_url?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: any;
  category: string;
  image_url?: string;
  published_at: string;
  authors: Author[];
}

const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase.rpc('get_articles_with_authors');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

const Insight = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;
  
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Calculate pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles?.slice(indexOfFirstArticle, indexOfLastArticle) || [];
  const totalPages = articles ? Math.ceil(articles.length / articlesPerPage) : 0;

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
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading articles. Please try again later.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full">
              {currentArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.slug}
                  title={article.title}
                  date={formatDate(article.published_at)}
                  description={article.description}
                  category={article.category}
                  authors={article.authors?.map(a => a.name) || []}
                  image={article.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f"}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
