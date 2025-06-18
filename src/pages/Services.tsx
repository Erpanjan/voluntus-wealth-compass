
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ServiceBentoGrid from '@/components/ServiceBentoGrid';
import WaitlistForm from '@/components/WaitlistForm';
import FAQAccordionSection from '@/components/FAQAccordionSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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

  // Value propositions with translations
  const valuePropositionItems = [
    {
      id: "control",
      title: t('value.control.title'),
      subtitle: t('value.control.subtitle'),
      description: t('value.control.description')
    },
    {
      id: "fiduciary",
      title: t('value.fiduciary.title'),
      subtitle: t('value.fiduciary.subtitle'),
      description: t('value.fiduciary.description')
    },
    {
      id: "simplicity",
      title: t('value.simplicity.title'),
      subtitle: t('value.simplicity.subtitle'),
      description: t('value.simplicity.description')
    },
    {
      id: "accountability",
      title: t('value.accountability.title'),
      subtitle: t('value.accountability.subtitle'),
      description: t('value.accountability.description')
    },
  ];

  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section */}
      <Hero 
        title={t('services.title')}
      />

      {/* Roadmap Section */}
      <Section id="roadmap" background="dark">
        <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-start max-w-3xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              {t('services.roadmap.title')}
            </h2>
            <div className="space-y-4 sm:space-y-6 text-white/70 text-base sm:text-lg font-light">
              <p className="mobile-text-base">
                {t('services.roadmap.text1')}
              </p>
              <p className="mobile-text-base">
                {t('services.roadmap.text2')}
              </p>
            </div>
            <Button 
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="#contact" className="inline-flex items-center">
                {t('common.joinWaitlist')} <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* What's Included Section - Now with Bento Grid */}
      <Section 
        id="whats-included" 
        title={t('services.whatsIncluded')}
        background="white"
        matchFAQHeight={false}
      >
        <div className="w-full">
          <ServiceBentoGrid services={serviceItems} />
        </div>
      </Section>

      {/* Value Propositions */}
      <div id="principles">
        <FAQAccordionSection 
          title={t('services.whyChooseUs')}
          subtitle={t('services.whyChooseUs.subtitle')}
          propositions={valuePropositionItems}
        />
      </div>

      {/* Pricing Section */}
      <Section 
        id="policy-fee" 
        background="dark"
      >
        <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-start max-w-3xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
              {t('services.pricing.title')}
            </h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg font-light text-white/70">
              <p className="mobile-text-base">
                {t('services.pricing.text1')}
              </p>
              <p className="mobile-text-base">
                {t('services.pricing.text2')}
              </p>
            </div>
            <Button
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="#contact" className="inline-flex items-center">
                {t('common.joinWaitlist')} <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Waitlist Form */}
      <Section id="contact">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Services;
