
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import HorizontalScrollCarousel from '@/components/HorizontalScrollCarousel';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  // Define the sections with translations
  const carouselSections = [
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero 
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
        background="transparent"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('home.ourServices')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Section Header */}
      <Section id="how-we-can-help" background="white" className="py-8 md:py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            {t('home.whatWeCanHelp')}
          </h2>
        </div>
      </Section>

      {/* Horizontal Scroll Carousel */}
      <HorizontalScrollCarousel sections={carouselSections} />

      {/* Waitlist Form Section */}
      <Section id="contact" background="light">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Index;
