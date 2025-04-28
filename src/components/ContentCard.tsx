
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ContentCardProps {
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
  className?: string;
  index?: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  description, 
  link, 
  buttonText = 'Learn more', 
  className,
  index = 0
}) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-voluntus-text-secondary mb-6">{description}</p>
      
      {link && (
        <Link 
          to={link} 
          className="inline-flex items-center text-voluntus-blue font-medium hover:underline"
        >
          {buttonText} <ArrowRight size={16} className="ml-1" />
        </Link>
      )}
    </div>
  );
};

export default ContentCard;
