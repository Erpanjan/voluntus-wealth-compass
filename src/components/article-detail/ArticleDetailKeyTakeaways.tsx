
import React from 'react';
import { Lightbulb } from 'lucide-react';

const ArticleDetailKeyTakeaways: React.FC = () => {
  // Sample key takeaways - in a real implementation, these would come from article data
  const keyTakeaways = [
    "Market volatility may persist as trade negotiations continue to evolve",
    "Diversification remains crucial for managing portfolio risk during uncertain times",
    "Long-term investors should focus on fundamental analysis rather than short-term market movements",
    "Emerging markets may present opportunities amid global trade adjustments"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8">
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
