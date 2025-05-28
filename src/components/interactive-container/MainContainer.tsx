
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

interface MainContainerProps {
  currentSection: SectionData;
  current: number;
  isFlipping: boolean;
  onNavigate: (index: number) => void;
  sectionsLength: number;
}

const MainContainer: React.FC<MainContainerProps> = ({
  currentSection,
  current,
  isFlipping,
  onNavigate,
  sectionsLength
}) => {
  const isMobile = useIsMobile();

  // Generate random rotation for polaroid effect
  const getRotation = (index: number) => {
    const rotations = [-2, 1.5, -1, 2.5, -1.5, 1];
    return rotations[index % rotations.length];
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-2xl transition-all duration-600 cursor-pointer z-10 mx-auto",
        isMobile ? "w-[90vw] max-w-md h-[420px] sm:h-[480px]" : "w-[500px] h-[480px]",
        isFlipping && "animate-pulse"
      )}
      style={{
        // Only apply rotation on desktop, keep mobile containers straight
        transform: isMobile ? 'rotate(0deg)' : `rotate(${getRotation(current)}deg)`,
      }}
      onClick={() => onNavigate((current + 1) % sectionsLength)}
    >
      {/* Polaroid-style container with enhanced mobile layout */}
      <div className={cn("h-full flex flex-col", isMobile ? "p-6 sm:p-7" : "p-6")}>
        {/* Content area - enhanced spacing for mobile */}
        <div className="flex-1 flex flex-col justify-center space-y-3 min-h-0">
          <h3 className={cn(
            "font-semibold text-black tracking-tight leading-tight",
            isMobile ? "text-2xl sm:text-3xl" : "text-2xl"
          )}>
            {currentSection.title}
          </h3>
          <div className={cn(
            "space-y-3 text-gray-600 leading-relaxed flex-1 overflow-hidden",
            isMobile ? "text-base sm:text-lg" : "text-base"
          )}>
            {currentSection.content}
          </div>
        </div>
        
        {/* Bottom action area - enhanced for mobile */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
          <Button 
            asChild 
            size={isMobile ? "default" : "default"}
            className="bg-black/80 hover:bg-black text-white transition-all duration-300"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={isMobile ? 16 : 16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default MainContainer;
