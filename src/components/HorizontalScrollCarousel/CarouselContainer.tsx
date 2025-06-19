
import React from 'react';
import XScroll from '@/components/ui/x-scroll';
import CarouselCard from './CarouselCard';
import { InfiniteItem } from './types';
import { CAROUSEL_CONFIG, CAROUSEL_CLASSES } from './carouselConfig';

interface CarouselContainerProps {
  scrollViewportRef: React.RefObject<HTMLDivElement>;
  infiniteItems: InfiniteItem[];
  cardWidth: number;
  isMobile: boolean;
}

const CarouselContainer: React.FC<CarouselContainerProps> = ({
  scrollViewportRef,
  infiniteItems,
  cardWidth,
  isMobile
}) => {
  const paddingConfig = isMobile ? CAROUSEL_CONFIG.MOBILE_PADDING : CAROUSEL_CONFIG.WEB_PADDING;
  const gapClass = isMobile ? 'gap-5 p-3 pb-8' : 'gap-10 p-6 pb-12';

  return (
    <div className="mx-auto w-full">
      <XScroll 
        ref={scrollViewportRef} 
        className={CAROUSEL_CLASSES.container}
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: CAROUSEL_CONFIG.SCROLL_BEHAVIOR
        }}
      >
        <div 
          className={`flex ${gapClass}`}
          style={{ 
            paddingLeft: paddingConfig.horizontal, 
            paddingRight: paddingConfig.horizontal 
          }}
        >
          {infiniteItems.map((section) => (
            <CarouselCard
              key={section.id}
              section={section}
              cardWidth={cardWidth}
              isMobile={isMobile}
            />
          ))}
        </div>
      </XScroll>
    </div>
  );
};

export default CarouselContainer;
