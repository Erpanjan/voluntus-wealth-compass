
import React from 'react';
import { ContentSection } from './types';

export const createCarouselSections = (t: (key: string) => string): ContentSection[] => [
  {
    id: "gambling",
    title: t('container.gambling.title'),
    content: (
      <>
        <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
          {t('container.gambling.text1')}
        </p>
        <p className="text-sm sm:text-base leading-6 sm:leading-7">
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
        <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
          {t('container.complicated.text1')}
        </p>
        <p className="text-sm sm:text-base leading-6 sm:leading-7">
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
        <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
          {t('container.bestInterest.text1')}
        </p>
        <p className="text-sm sm:text-base leading-6 sm:leading-7">
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
        <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
          {t('container.accountability.text1')}
        </p>
        <p className="text-sm sm:text-base leading-6 sm:leading-7">
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
        <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
          {t('container.staticAdvice.text1')}
        </p>
        <p className="text-sm sm:text-base leading-6 sm:leading-7">
          {t('container.staticAdvice.text2')}
        </p>
      </>
    )
  }
];
