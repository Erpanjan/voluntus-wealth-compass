
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import StackingCards from '@/components/ui/StackingCards';
import StackingCardItem from '@/components/ui/StackingCardItem';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
  imageSrc?: string;
}

interface StackingCardsDemoProps {
  services: ServiceItem[];
}

const cardColors = [
  'bg-[#f97316]', // Orange
  'bg-[#0015ff]', // Blue
  'bg-[#ff5941]', // Red
  'bg-[#1f464d]', // Dark teal
];

const StackingCardsDemo: React.FC<StackingCardsDemoProps> = ({ services }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div
      className="h-[620px] bg-white overflow-auto text-white"
      ref={(node) => setContainer(node)}
    >
      <StackingCards
        totalCards={services.length}
        scrollOptions={{ container: { current: container } }}
      >
        <div className="relative h-[620px] w-full z-10 text-2xl md:text-4xl font-semibold flex justify-center items-center text-[#333333] whitespace-pre">
          Scroll down to explore our services ↓
        </div>
        
        {services.map((service, index) => (
          <StackingCardItem key={service.id} index={index} className="h-[620px]">
            <div
              className={cn(
                cardColors[index % cardColors.length],
                "h-[80%] sm:h-[70%] flex-col sm:flex-row px-8 py-10 flex w-11/12 rounded-3xl mx-auto relative"
              )}
            >
              <div className="flex-1 flex flex-col justify-center pr-0 sm:pr-8">
                <h3 className="font-semibold text-2xl sm:text-3xl mb-5 text-white">
                  {service.title}
                </h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                  {service.content}
                </p>
              </div>

              <div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden bg-white/10 flex items-center justify-center mt-6 sm:mt-0">
                {service.imageSrc ? (
                  <img
                    src={service.imageSrc}
                    alt={service.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-white/70 text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-sm">Image Placeholder</div>
                  </div>
                )}
              </div>
            </div>
          </StackingCardItem>
        ))}

        <div className="w-full h-80 relative overflow-hidden">
          <h2 className="absolute bottom-0 left-0 translate-y-1/3 text-[60px] sm:text-[120px] text-[#333333] font-bold opacity-20">
            Services
          </h2>
        </div>
      </StackingCards>
    </div>
  );
};

export default StackingCardsDemo;
