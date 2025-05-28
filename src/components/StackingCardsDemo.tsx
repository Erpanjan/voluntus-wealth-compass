
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

// Updated color scheme to match theme
const cardColors = [
  'bg-[#333333]', // Charcoal - primary text color
  'bg-[#0D9488]', // Teal dark - from voluntus palette
  'bg-black', // Pure black
  'bg-[#9F9EA1]', // Medium gray - from voluntus palette
];

const StackingCardsDemo: React.FC<StackingCardsDemoProps> = ({ services }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div
      className="h-[620px] sm:h-[800px] bg-white overflow-auto text-white"
      ref={(node) => setContainer(node)}
    >
      <StackingCards
        totalCards={services.length}
        scrollOptions={{ container: { current: container } }}
      >
        {services.map((service, index) => (
          <StackingCardItem key={service.id} index={index} className="h-[620px] sm:h-[750px]">
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
      </StackingCards>
    </div>
  );
};

export default StackingCardsDemo;
