
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  // Editorial content blocks for NEO GEMMA style
  const editorialBlocks = [
    {
      id: 'investment-solutions',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600',
      headline: t('service.investment.title'),
      description: t('service.investment.content'),
      meta: 'INVESTMENT SOLUTIONS'
    },
    {
      id: 'dedicated-advisors',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=1200&h=600',
      headline: t('service.advisor.title'),
      description: t('service.advisor.content'),
      meta: 'ADVISORY SERVICES'
    },
    {
      id: 'risk-management',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=600',
      headline: t('service.risk.title'),
      description: t('service.risk.content'),
      meta: 'RISK MANAGEMENT'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero 
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
      >
        <Button 
          asChild 
          size="lg"
          variant="outline"
        >
          <Link to="/services" className="inline-flex items-center">
            {t('home.ourServices')} <ArrowRight size={16} className="ml-3" />
          </Link>
        </Button>
      </Hero>

      {/* Editorial Content Blocks */}
      <Section background="white" className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto space-y-24 md:space-y-32">
          {editorialBlocks.map((block, index) => (
            <article key={block.id} className="editorial-block">
              <img 
                src={block.image} 
                alt={block.headline}
                className="editorial-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="text-right mb-4">
                <span className="editorial-meta">{block.meta}</span>
              </div>
              <h2 className="editorial-headline">{block.headline}</h2>
              <p className="editorial-description">{block.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Minimal Call to Action */}
      <Section background="white" className="py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-black">
            Ready to get started?
          </h2>
          <Button 
            asChild 
            size="lg"
            variant="outline"
          >
            <Link to="/contact" className="inline-flex items-center">
              GET UPDATES <ArrowRight size={16} className="ml-3" />
            </Link>
          </Button>
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
