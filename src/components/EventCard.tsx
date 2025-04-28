
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  title?: string;
  description?: string;
  image?: string; 
  link?: string;
  buttonText?: string;
  className?: string;
  upcoming?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  title = "Coming soon",
  description = "Stay tuned for upcoming events",
  image = "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80",
  link = "#",
  buttonText = "Learn more",
  className,
  upcoming = true
}) => {
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden shadow-md group aspect-[4/3]",
        className
      )}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
        <div>
          {upcoming && (
            <span className="inline-block bg-voluntus-blue px-3 py-1 rounded-full text-xs font-medium mb-4">
              {upcoming ? 'Upcoming Event' : 'Previous Event'}
            </span>
          )}
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-200 mb-4 line-clamp-2">{description}</p>
        </div>
        
        <a 
          href={link} 
          className="inline-flex items-center text-white font-medium hover:text-voluntus-blue transition-colors"
        >
          {buttonText} <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default EventCard;
