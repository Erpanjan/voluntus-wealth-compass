
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        background="brand-primary"
      />

      {/* Vision Section */}
      <Section background="brand-secondary">
        <div className="max-w-4xl mx-auto text-center flex items-center justify-center min-h-[200px]">
          <h2 className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-brand-accent text-left py-4 mx-4 sm:mx-6 md:mx-[24px] px-0 font-light lg:text-5xl lg:leading-relaxed">
            {t('about.vision')}
          </h2>
        </div>
      </Section>

      {/* Waitlist Form */}
      <Section id="contact" background="white">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default About;
