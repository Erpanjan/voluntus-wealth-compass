
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Article } from '@/types/multilingual-article.types';

interface ArticleDetailKeyTakeawaysProps {
  article: Article;
}

const ArticleDetailKeyTakeaways: React.FC<ArticleDetailKeyTakeawaysProps> = ({ article }) => {
  // Use the article description/summary as key takeaways
  // Split by periods and filter out empty strings to create bullet points
  const keyTakeaways = article.description 
    ? article.description
        .split('.')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => item + (item.endsWith('.') ? '' : '.'))
    : ["No key takeaways available for this article."];

  return (
    <div className="bg-gray-50 rounded-2xl shadow-soft border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-voluntus-teal-light rounded-full flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-voluntus-teal-dark" />
        </div>
        <h3 className="text-2xl font-poppins font-semibold text-gray-900">
          Key Takeaways
        </h3>
      </div>
      
      <div className="space-y-4">
        {keyTakeaways.map((takeaway, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-2 h-2 bg-voluntus-teal-dark rounded-full mt-3 flex-shrink-0" />
            <p className="text-gray-700 leading-relaxed text-lg">
              {takeaway}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetailKeyTakeaways;
