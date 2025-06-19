
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

  return (
    <div className="min-h-screen bg-brand-white-smoke">
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
            className="bg-brand-black-olive hover:bg-brand-black-olive/90 text-white transition-all duration-300 shadow-brand"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('home.ourServices')} <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Horizontal Scroll Carousel Section */}
      <Section id="how-we-can-help" background="almond" className="py-16 md:py-20">
        <div className="w-full">
          <HorizontalScrollCarousel />
        </div>
      </Section>

      {/* Waitlist Form Section */}
      <Section id="contact" background="white">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Index;
