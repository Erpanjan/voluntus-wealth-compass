
import React from 'react';

interface ArticleDetailImageProps {
  imageUrl: string;
  title: string;
}

const ArticleDetailImage: React.FC<ArticleDetailImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-96 md:h-[32rem] object-cover"
          onError={(e) => {
            console.warn('⚠️ [ArticleDetailImage] Failed to load article image:', imageUrl);
            const target = e.target as HTMLImageElement;
            target.parentElement!.style.background = '#F3F4F6';
            target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default ArticleDetailImage;
