
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Json } from '@/integrations/supabase/types';

interface Author {
  id: string;
  name: string;
  image_url?: string;
}

interface Report {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
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
  created_at: string;
  updated_at: string;
  authors: Author[];
  reports: Report[];
}

interface RawArticleResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: Json;
  category: string;
  image_url: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors: Json;
  reports: Json;
}

const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
  const { data, error } = await supabase.rpc('get_article_by_slug', { slug_param: slug });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (data && data.length > 0) {
    const rawData = data[0] as RawArticleResponse;
    return {
      ...rawData,
      authors: Array.isArray(rawData.authors) ? rawData.authors as Author[] : [],
      reports: Array.isArray(rawData.reports) ? rawData.reports as Report[] : []
    };
  }
  
  return null;
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleBySlug(id || ''),
    enabled: !!id
  });

  // Handle date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Render content from JSON
  const renderContent = (content: any) => {
    if (!content) return null;
    
    // If content is a string, render it directly
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    // Otherwise, if it's an array of content blocks
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block.type === 'paragraph') {
          return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: block.content }} />;
        } else if (block.type === 'heading') {
          return <h2 key={index} className="text-2xl font-semibold mt-6 mb-4">{block.content}</h2>;
        } else if (block.type === 'image') {
          return (
            <div key={index} className="my-6">
              <img src={block.url} alt={block.caption || ''} className="w-full rounded-lg" />
              {block.caption && <p className="text-sm text-center mt-2 text-gray-500">{block.caption}</p>}
            </div>
          );
        } else if (block.type === 'list') {
          return (
            <ul key={index} className="list-disc pl-5 mb-4">
              {block.items?.map((item: string, i: number) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ul>
          );
        } else {
          return <div key={index}>{block.content}</div>;
        }
      });
    }
    
    return <p className="text-voluntus-text-secondary">No content available</p>;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] pt-32">
        <div className="container-custom pb-20">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Error loading article. Please try again later.</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/insight')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-32">
      <div className="container-custom pb-20">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center text-sm hover:bg-white/50"
            onClick={() => navigate('/insight')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Button>
        </div>

        {isLoading ? (
          <Card className="overflow-hidden bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-64 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ) : article ? (
          <Card className="overflow-hidden bg-white rounded-xl shadow-sm">
            {article.image_url && (
              <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              {article.category && (
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-voluntus-text-tertiary">
                    {article.category}
                  </span>
                </div>
              )}
              
              <h1 className="text-3xl md:text-4xl font-semibold mb-4">{article.title}</h1>
              
              <div className="flex flex-wrap items-center mb-8 text-sm text-voluntus-text-tertiary">
                <span>{formatDate(article.published_at)}</span>
                {article.authors && article.authors.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>By {article.authors.map(a => a.name).join(', ')}</span>
                  </>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl font-medium mb-8 text-black">{article.description}</p>
                
                <div className="text-voluntus-text-secondary">
                  {renderContent(article.content)}
                </div>
              </div>
              
              {/* Reports section */}
              {article.reports && article.reports.length > 0 && (
                <div className="mt-12 border-t pt-8">
                  <h2 className="text-2xl font-semibold mb-6">Related Reports</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {article.reports.map(report => (
                      <Card key={report.id} className="p-4 flex items-start">
                        <FileText className="h-10 w-10 text-voluntus-text-tertiary mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          <h3 className="font-medium text-lg mb-1">{report.title}</h3>
                          {report.description && (
                            <p className="text-sm text-voluntus-text-secondary mb-3">{report.description}</p>
                          )}
                          <a 
                            href={report.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-voluntus-blue hover:underline"
                          >
                            <Download className="h-4 w-4 mr-1" /> Download Report
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-12 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => navigate('/insight')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Insights
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Article not found</h2>
            <p className="mb-6">The requested article could not be found.</p>
            <Button onClick={() => navigate('/insight')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Insights
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
