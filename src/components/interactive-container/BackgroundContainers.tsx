
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

interface BackgroundContainersProps {
  sections: SectionData[];
  current: number;
  onNavigate: (index: number) => void;
}

const BackgroundContainers: React.FC<BackgroundContainersProps> = ({
  sections,
  current,
  onNavigate
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {sections.map((section, index) => {
          if (index === current) return null;
          
          const isNext = index === (current + 1) % sections.length;
          const isPrev = index === (current - 1 + sections.length) % sections.length;
          
          return (
            <div
              key={section.id}
              className={cn(
                "absolute w-[85vw] max-w-sm h-[400px] sm:w-[90vw] sm:max-w-md sm:h-[460px] bg-white rounded-2xl shadow-lg transition-all duration-1000 cursor-pointer",
                "opacity-10 scale-75",
                isNext && "translate-x-32 sm:translate-x-40",
                isPrev && "-translate-x-32 sm:-translate-x-40"
              )}
              style={{
                zIndex: 1
              }}
              onClick={() => onNavigate(index)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {sections.map((section, index) => {
        if (index === current) return null;
        
        const isNext = index === (current + 1) % sections.length;
        const isPrev = index === (current - 1 + sections.length) % sections.length;
        const isFarNext = index === (current + 2) % sections.length;
        const isFarPrev = index === (current - 2 + sections.length) % sections.length;
        
        let transform = '';
        let opacity = 0.02;
        let scale = 0.6;
        let zIndex = 1;
        
        if (isNext) {
          transform = 'translateX(400px) rotate(8deg)';
          opacity = 0.05;
          scale = 0.8;
          zIndex = 2;
        } else if (isPrev) {
          transform = 'translateX(-400px) rotate(-8deg)';
          opacity = 0.05;
          scale = 0.8;
          zIndex = 2;
        } else if (isFarNext) {
          transform = 'translateX(650px) rotate(12deg)';
          opacity = 0.03;
          scale = 0.6;
        } else if (isFarPrev) {
          transform = 'translateX(-650px) rotate(-12deg)';
          opacity = 0.03;
          scale = 0.6;
        }
        
        return (
          <div
            key={section.id}
            className="absolute w-[500px] h-[500px] bg-white rounded-2xl shadow-xl transition-all duration-1000 cursor-pointer"
            style={{
              transform: `${transform} scale(${scale})`,
              opacity,
              zIndex
            }}
            onClick={() => onNavigate(index)}
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <h3 className="text-2xl font-semibold text-black tracking-tight leading-tight">
                  {section.title}
                </h3>
                <div className="space-y-3 text-gray-600 text-base leading-relaxed">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundContainers;
