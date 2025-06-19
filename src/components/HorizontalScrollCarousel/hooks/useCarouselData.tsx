
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentSection, InfiniteItem } from '../types';
import { CAROUSEL_CONFIG } from '../carouselConfig';

export const useCarouselData = () => {
  const { t } = useLanguage();

  const containerSections: ContentSection[] = useMemo(() => [
    {
      id: "gambling",
      title: t('container.gambling.title'),
      content: (
        <>
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.gambling.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.complicated.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.bestInterest.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.accountability.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.staticAdvice.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.staticAdvice.text2')}
          </p>
        </>
      )
    }
  ], [t]);

  // Create three copies for infinite scroll
  const infiniteItems: InfiniteItem[] = useMemo(() => {
    const items: InfiniteItem[] = [];
    for (let copy = 1; copy <= CAROUSEL_CONFIG.SECTION_COPIES; copy++) {
      containerSections.forEach((section, index) => {
        items.push({
          ...section,
          id: `${section.id}-${copy}`,
          originalIndex: index
        });
      });
    }
    return items;
  }, [containerSections]);

  return {
    containerSections,
    infiniteItems
  };
};
