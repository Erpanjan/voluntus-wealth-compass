
import React, { useEffect, useRef, useCallback } from 'react';
import XScroll from '@/components/ui/x-scroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const containerSections: ContentSection[] = [
    {
      id: "gambling",
      title: t('container.gambling.title'),
      content: (
        <>
          <p className="mb-3">
            {t('container.gambling.text1')}
          </p>
          <p>
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
          <p className="mb-3">
            {t('container.complicated.text1')}
          </p>
          <p>
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
          <p className="mb-3">
            {t('container.bestInterest.text1')}
          </p>
          <p>
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
          <p className="mb-3">
            {t('container.accountability.text1')}
          </p>
          <p>
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
          <p className="mb-3">
            {t('container.staticAdvice.text1')}
          </p>
          <p>
            {t('container.staticAdvice.text2')}
          </p>
        </>
      )
    }
  ];

  // Create three copies for infinite scroll
  const infiniteItems = [
    ...containerSections.map(section => ({ ...section, id: `${section.id}-1` })),
    ...containerSections.map(section => ({ ...section, id: `${section.id}-2` })),
    ...containerSections.map(section => ({ ...section, id: `${section.id}-3` }))
  ];

  const cardWidth = 320 + 24; // 320px width + 24px gap
  const sectionLength = containerSections.length;

  const handleScroll = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const maxScroll = scrollWidth - clientWidth;
    const sectionWidth = cardWidth * sectionLength;

    // Reset to middle section when scrolling near the edges
    if (scrollLeft <= sectionWidth * 0.1) {
      // Near the beginning, jump to the end of the first complete section
      viewport.scrollTo({
        left: scrollLeft + sectionWidth,
        behavior: 'auto'
      });
    } else if (scrollLeft >= maxScroll - sectionWidth * 0.1) {
      // Near the end, jump to the beginning of the second complete section
      viewport.scrollTo({
        left: scrollLeft - sectionWidth,
        behavior: 'auto'
      });
    }
  }, [cardWidth, sectionLength]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    // Initial position to start in the middle section
    const initialPosition = cardWidth * sectionLength;
    viewport.scrollTo({
      left: initialPosition,
      behavior: 'auto'
    });

    // Add scroll listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    viewport.addEventListener('scroll', throttledScroll);
    return () => viewport.removeEventListener('scroll', throttledScroll);
  }, [handleScroll, cardWidth, sectionLength]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 sm:mb-12 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
          {t('home.whatWeCanHelp')}
        </h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="mx-auto w-full">
        <XScroll ref={scrollViewportRef}>
          <div className="flex gap-6 p-6 pb-8">
            {infiniteItems.map((section) => (
              <div
                key={section.id}
                className="grid w-80 shrink-0 place-items-start rounded-2xl bg-white p-6 shadow-soft"
              >
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-black mb-4 leading-tight">
                    {section.title}
                  </h3>
                  <div className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {section.content}
                  </div>
                  <Button 
                    asChild 
                    size="default"
                    className="bg-black/80 hover:bg-black text-white transition-all duration-200 self-start"
                  >
                    <Link to="/services" className="inline-flex items-center">
                      {t('home.howWeCanHelp')} <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </XScroll>
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
