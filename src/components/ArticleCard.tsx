
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  title: string;
  date: string;
  description: string;
  link?: string;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  title, 
  date, 
  description, 
  link = '#',
  className 
}) => {
  return (
    <Link 
      to={link}
      className={cn(
        "block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <article>
        <h3 className="text-lg font-semibold mb-2 hover:text-voluntus-blue transition-colors">{title}</h3>
        <p className="text-sm text-voluntus-text-secondary mb-4">{date}</p>
        <p className="text-voluntus-text-secondary line-clamp-3">{description}</p>
      </article>
    </Link>
  );
};

export default ArticleCard;
