
import React from 'react';

interface ArticleDetailImageProps {
  imageUrl: string;
  title: string;
}

const ArticleDetailImage: React.FC<ArticleDetailImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="mb-8">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-80 object-cover"
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
