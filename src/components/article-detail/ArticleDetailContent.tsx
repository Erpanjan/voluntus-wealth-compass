import React from 'react';

interface ArticleDetailContentProps {
  content: any;
}

const ArticleDetailContent: React.FC<ArticleDetailContentProps> = ({ content }) => {
  // Enhanced content rendering that handles both HTML strings and JSON blocks
  const renderContent = (content: any) => {
    console.log('🔍 [ArticleDetailContent] Rendering content:', { content, type: typeof content });

    if (!content) {
      return <p className="text-gray-600 italic">No content available.</p>;
    }

    // Handle HTML string content (most common case from database)
    if (typeof content === 'string') {
      // Check if it's HTML by looking for HTML tags
      if (content.includes('<') && content.includes('>')) {
        return (
          <div 
            className="article-content prose prose-lg max-w-none 
                       prose-headings:font-poppins prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:leading-tight
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                       prose-ul:mb-6 prose-ol:mb-6 prose-li:text-gray-700 prose-li:leading-relaxed
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r prose-blockquote:text-gray-800 prose-blockquote:italic
                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-800
                       prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      } else {
        // Plain text content
        return <div className="article-content prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">{content}</div>;
      }
    }

    // Handle JSON block content (for backward compatibility)
    if (typeof content === 'object') {
      if (content.blocks && Array.isArray(content.blocks)) {
        return (
          <div className="article-content prose prose-lg max-w-none">
            {content.blocks.map((block: any, index: number) => {
              switch (block.type) {
                case 'paragraph':
                  return <p key={index} className="mb-6 leading-relaxed text-gray-700">{block.data?.text || ''}</p>;
                case 'header':
                  const HeaderTag = `h${Math.min(block.data?.level || 2, 6)}` as keyof JSX.IntrinsicElements;
                  return <HeaderTag key={index} className="font-poppins font-semibold text-gray-900 mb-4">{block.data?.text || ''}</HeaderTag>;
                case 'list':
                  const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
                  return (
                    <ListTag key={index} className="mb-6 ml-6">
                      {block.data?.items?.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="mb-2 leading-relaxed text-gray-700">{item}</li>
                      ))}
                    </ListTag>
                  );
                default:
                  return <div key={index} className="mb-6 p-4 bg-gray-50 rounded text-sm font-mono text-gray-600">{JSON.stringify(block.data)}</div>;
              }
            })}
          </div>
        );
      } else {
        // Other object formats
        return <div className="article-content prose prose-lg max-w-none p-4 bg-gray-50 rounded text-sm font-mono text-gray-600">{JSON.stringify(content, null, 2)}</div>;
      }
    }

    // Fallback for unknown content types
    return <div className="article-content prose prose-lg max-w-none text-gray-700">{String(content)}</div>;
  };

  return (
    <article className="mb-12">
      {renderContent(content)}
    </article>
  );
};

export default ArticleDetailContent;
