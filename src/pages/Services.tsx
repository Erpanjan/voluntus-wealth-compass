
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import FeatureCardGrid from '@/components/FeatureCardGrid';
import TabContent from '@/components/TabContent';
import WaitlistForm from '@/components/WaitlistForm';
import FAQAccordionSection from '@/components/FAQAccordionSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  // Services data
  const serviceItems = [
    {
      id: 'investment',
      title: t('investment_title', 'services'),
      content: t('investment_content', 'services')
    },
    {
      id: 'advisor',
      title: t('advisor_title', 'services'),
      content: t('advisor_content', 'services')
    },
    {
      id: 'risk',
      title: t('risk_title', 'services'),
      content: t('risk_content', 'services')
    },
    {
      id: 'policy',
      title: t('policy_title', 'services'),
      content: t('policy_content', 'services')
    },
  ];

  // Value propositions
  const valuePropositionItems = [
    {
      id: "control",
      title: t('control_title', 'services'),
      subtitle: t('control_subtitle', 'services'),
      description: t('control_desc', 'services')
    },
    {
      id: "fiduciary",
      title: t('fiduciary_title', 'services'),
      subtitle: t('fiduciary_subtitle', 'services'),
      description: t('fiduciary_desc', 'services')
    },
    {
      id: "simplicity",
      title: t('simplicity_title', 'services'),
      subtitle: t('simplicity_subtitle', 'services'),
      description: t('simplicity_desc', 'services')
    },
    {
      id: "accountability",
      title: t('accountability_title', 'services'),
      subtitle: t('accountability_subtitle', 'services'),
      description: t('accountability_desc', 'services')
    },
  ];

  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section */}
      <Hero 
        titleKey="hero_title" 
        section="services"
      />

      {/* Roadmap Section */}
      <Section id="roadmap" background="dark">
        <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-start max-w-3xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              {t('roadmap_title', 'services')}
            </h2>
            <div className="space-y-4 sm:space-y-6 text-white/70 text-base sm:text-lg font-light">
              <p className="mobile-text-base">
                {t('roadmap_desc1', 'services')}
              </p>
              <p className="mobile-text-base">
                {t('roadmap_desc2', 'services')}
              </p>
            </div>
            <Button 
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="#contact" className="inline-flex items-center">
                {t('join_waitlist', 'services')} <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* What's Included Section - Updated to use FeatureCardGrid */}
      <Section id="whats-included" titleKey="whats_included" section="services" background="white">
        <div className="w-full">
          <FeatureCardGrid services={serviceItems} />
        </div>
      </Section>

      {/* Value Propositions - Replace with FAQAccordionSection */}
      <div id="principles">
        <FAQAccordionSection 
          title={t('why_choose_us', 'services')} 
          subtitle={t('what_sets_apart', 'services')} 
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
              {t('pricing_title', 'services')}
            </h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg font-light text-white/70">
              <p className="mobile-text-base">
                {t('pricing_desc1', 'services')}
              </p>
              <p className="mobile-text-base">
                {t('pricing_desc2', 'services')}
              </p>
            </div>
            <Button
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="#contact" className="inline-flex items-center">
                {t('join_waitlist', 'services')} <ArrowRight size={18} className="ml-2" />
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
