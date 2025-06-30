
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-minimal Hero */}
      <Hero 
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        background="white"
      />

      {/* Editorial Featured Section */}
      <Section background="white" className="py-32">
        <div className="max-w-5xl mx-auto">
          {/* Large featured image */}
          <div className="editorial-spacing">
            <img 
              src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80&w=1200&h=700"
              alt="About Us"
              className="editorial-image w-full h-[500px] md:h-[700px] object-cover"
            />
          </div>
          
          {/* Editorial content */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-light tracking-wide mb-12 leading-tight">
              Our Vision
            </h3>
            <p className="text-lg md:text-xl font-light text-gray-600 leading-loose">
              {t('about.vision')}
            </p>
          </div>
          
          {/* Minimal metadata */}
          <div className="text-center mt-16">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • VOLUNTAS TEAM
            </p>
          </div>
        </div>
      </Section>

      {/* Minimal Contact */}
      <Section background="white" className="py-32">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default About;
