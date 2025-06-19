
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedCarousel from './carousel/EnhancedCarousel';
import CarouselCard from './carousel/CarouselCard';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const EnhancedHorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerSections: ContentSection[] = [
    {
      id: "gambling",
      title: t('container.gambling.title'),
      content: (
        <>
          <p className="mb-4 text-inherit leading-relaxed">
            {t('container.gambling.text1')}
          </p>
          <p className="text-inherit leading-relaxed">
            {t('container.gambling.text2')}
          </p>
        </>
      )
    },
    {
      id: "complicated",
      title: t('container.complicated.title'),
      content: (
        <>
          <p className="mb-4 text-inherit leading-relaxed">
            {t('container.complicated.text1')}
          </p>
          <p className="text-inherit leading-relaxed">
            {t('container.complicated.text2')}
          </p>
        </>
      )
    },
    {
      id: "best-interest",
      title: t('container.bestInterest.title'),
      content: (
        <>
          <p className="mb-4 text-inherit leading-relaxed">
            {t('container.bestInterest.text1')}
          </p>
          <p className="text-inherit leading-relaxed">
            {t('container.bestInterest.text2')}
          </p>
        </>
      )
    },
    {
      id: "accountability",
      title: t('container.accountability.title'),
      content: (
        <>
          <p className="mb-4 text-inherit leading-relaxed">
            {t('container.accountability.text1')}
          </p>
          <p className="text-inherit leading-relaxed">
            {t('container.accountability.text2')}
          </p>
        </>
      )
    },
    {
      id: "static-advice",
      title: t('container.staticAdvice.title'),
      content: (
        <>
          <p className="mb-4 text-inherit leading-relaxed">
            {t('container.staticAdvice.text1')}
          </p>
          <p className="text-inherit leading-relaxed">
            {t('container.staticAdvice.text2')}
          </p>
        </>
      )
    }
  ];

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight font-poppins">
            {t('home.whatWeCanHelp')}
          </h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight font-poppins text-black">
          {t('home.whatWeCanHelp')}
        </h2>
      </div>

      {/* Enhanced Carousel Container */}
      <div className="w-full px-4 sm:px-6">
        <EnhancedCarousel
          autoplay={true}
          autoplayDelay={7000}
          showIndicators={true}
          showNavigation={true}
          className="w-full"
        >
          {containerSections.map((section, index) => (
            <CarouselCard
              key={section.id}
              title={section.title}
              content={section.content}
              index={index}
            />
          ))}
        </EnhancedCarousel>
      </div>
    </div>
  );
};

export default EnhancedHorizontalScrollCarousel;
