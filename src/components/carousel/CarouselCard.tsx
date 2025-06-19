
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CarouselCardProps {
  title: string;
  content: React.ReactNode;
  index: number;
  isActive?: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  title,
  content,
  index,
  isActive = false,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full mx-auto rounded-3xl bg-white shadow-soft hover:shadow-hover transition-all duration-500 relative overflow-hidden group",
        isMobile ? "max-w-[95vw] min-h-[300px]" : "max-w-[800px] min-h-[400px]",
        isActive && "shadow-hover"
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Progress Badge */}
      <div className={cn(
        "absolute bg-black/10 backdrop-blur-sm text-gray-700 rounded-full text-sm font-medium z-10",
        isMobile ? "top-4 right-4 px-3 py-1.5" : "top-6 right-6 px-4 py-2"
      )}>
        {index + 1}
      </div>
      
      <div className={cn(
        "h-full flex flex-col relative z-10",
        isMobile ? "p-6 pt-5" : "p-8 lg:p-12 pt-6"
      )}>
        {/* Title with enhanced typography */}
        <h3 className={cn(
          "font-semibold text-black mb-6 leading-tight font-poppins",
          isMobile ? "text-xl pr-12" : "text-2xl lg:text-3xl xl:text-4xl pr-16"
        )}>
          {title}
        </h3>
        
        {/* Content with improved spacing */}
        <div className={cn(
          "text-gray-600 flex-1 font-poppins",
          isMobile ? "mb-6 text-base leading-relaxed" : "mb-8 lg:mb-10 text-lg leading-relaxed"
        )}>
          {content}
        </div>
        
        {/* Enhanced CTA Button */}
        <div className="flex items-center">
          <Button 
            asChild 
            size={isMobile ? "default" : "lg"}
            className={cn(
              "bg-black/80 hover:bg-black text-white transition-all duration-300 self-start group/btn",
              "hover:shadow-lg hover:scale-105 active:scale-95"
            )}
          >
            <Link to="/services" className="inline-flex items-center">
              {t('home.howWeCanHelp')} 
              <ArrowRight 
                size={isMobile ? 16 : 18} 
                className="ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" 
              />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-gray-200 transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default CarouselCard;
