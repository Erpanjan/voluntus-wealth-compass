
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ServiceFeatureGrid from '@/components/ServiceFeatureGrid';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  // Services data with translations
  const serviceItems = [
    {
      id: 'investment',
      title: t('service.investment.title'),
      content: t('service.investment.content')
    },
    {
      id: 'advisor',
      title: t('service.advisor.title'),
      content: t('service.advisor.content')
    },
    {
      id: 'risk',
      title: t('service.risk.title'),
      content: t('service.risk.content')
    },
    {
      id: 'policy',
      title: t('service.policy.title'),
      content: t('service.policy.content')
    },
  ];

  return (
    <div className="min-h-screen font-inter bg-white">
      {/* Ultra-minimal Hero */}
      <Hero title={t('services.title')} />

      {/* Editorial Featured Image Section */}
      <Section background="white" className="py-32">
        <div className="max-w-5xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=1200&h=600"
            alt="Financial Services"
            className="editorial-image w-full h-[500px] md:h-[700px] object-cover mb-16"
          />
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-light tracking-wide mb-8 leading-tight">
              {t('services.roadmap.title')}
            </h3>
            <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed mb-8">
              {t('services.roadmap.text1')}
            </p>
            <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed mb-12">
              {t('services.roadmap.text2')}
            </p>
            <Button asChild variant="default" size="lg">
              <Link to="#contact">
                {t('common.joinWaitlist')}
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Services Grid - Editorial Style */}
      <Section background="white" className="py-32">
        <ServiceFeatureGrid services={serviceItems} />
      </Section>

      {/* Pricing Section - Editorial */}
      <Section background="white" className="py-32">
        <div className="max-w-5xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=80&w=1200&h=600"
            alt="Pricing Structure"
            className="editorial-image w-full h-[400px] md:h-[600px] object-cover mb-16"
          />
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-light tracking-wide mb-8 leading-tight">
              {t('services.pricing.title')}
            </h3>
            <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed mb-8">
              {t('services.pricing.text1')}
            </p>
            <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed mb-12">
              {t('services.pricing.text2')}
            </p>
            <Button asChild variant="default" size="lg">
              <Link to="#contact">
                {t('common.joinWaitlist')}
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Minimal Contact */}
      <Section id="contact" background="white" className="py-32">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Services;
