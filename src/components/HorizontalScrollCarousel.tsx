
import React from 'react';
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
        <XScroll>
          <div className="flex gap-6 p-6 pb-8">
            {containerSections.map((section) => (
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
