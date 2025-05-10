
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContentCard from '@/components/ContentCard';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import SectionCarousel from '@/components/SectionCarousel';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  // Define the carousel sections
  const carouselSections = [
    {
      id: "gambling",
      title: t('question_gambling', 'home'),
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            {t('gambling_desc1', 'home')}
          </p>
          <p className="mb-4 mobile-text-base">
            {t('gambling_desc2', 'home')}
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('services_button', 'home')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    },
    {
      id: "complicated",
      title: t('question_complicated', 'home'),
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            {t('complicated_desc1', 'home')}
          </p>
          <p className="mb-4 mobile-text-base">
            {t('complicated_desc2', 'home')}
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('services_button', 'home')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    },
    {
      id: "best-interest",
      title: t('question_best_interest', 'home'),
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            {t('best_interest_desc1', 'home')}
          </p>
          <p className="mb-4 mobile-text-base">
            {t('best_interest_desc2', 'home')}
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('services_button', 'home')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    },
    {
      id: "accountability",
      title: t('question_accountability', 'home'),
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            {t('accountability_desc1', 'home')}
          </p>
          <p className="mb-4 mobile-text-base">
            {t('accountability_desc2', 'home')}
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('services_button', 'home')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero 
        titleKey="hero_title"
        subtitleKey="hero_subtitle"
        section="home"
        background="transparent"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('services_button', 'home')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Updated Section with auto height */}
      <Section id="how-we-can-help" background="white" className="py-6 md:py-12" titleKey="how_we_can_help" section="home">
        <div className="w-full">
          <SectionCarousel sections={carouselSections} />
        </div>
      </Section>

      {/* Waitlist Form Section */}
      <Section id="contact" background="light">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Index;
