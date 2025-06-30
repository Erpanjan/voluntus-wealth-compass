
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  // Editorial content blocks
  const editorialBlocks = [
    {
      id: 'gambling',
      title: t('container.gambling.title'),
      description: t('container.gambling.text1'),
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200&h=800'
    },
    {
      id: 'complicated',
      title: t('container.complicated.title'),
      description: t('container.complicated.text1'),
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=800'
    },
    {
      id: 'best-interest',
      title: t('container.bestInterest.title'),
      description: t('container.bestInterest.text1'),
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200&h=800'
    },
    {
      id: 'accountability',
      title: t('container.accountability.title'),
      description: t('container.accountability.text1'),
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200&h=800'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-minimal Hero */}
      <Hero 
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
        background="white"
      >
        <div className="flex justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/services">
              {t('home.ourServices')}
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Editorial Content Blocks */}
      <Section background="white" className="py-32">
        <div className="w-full">
          {/* Section title */}
          <div className="editorial-spacing-large text-center">
            <h2 className="font-light tracking-wide leading-tight">
              {t('home.whatWeCanHelp')}
            </h2>
          </div>
          
          {/* Editorial blocks */}
          <div className="space-y-32 md:space-y-48">
            {editorialBlocks.map((block, index) => (
              <article key={block.id} className="max-w-5xl mx-auto">
                {/* Large featured image */}
                <div className="editorial-spacing">
                  <img 
                    src={block.image}
                    alt={block.title}
                    className="editorial-image w-full h-[400px] md:h-[600px] object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                
                {/* Editorial content */}
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl md:text-4xl font-light tracking-wide mb-8 leading-tight">
                    {block.title}
                  </h3>
                  <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                
                {/* Minimal metadata */}
                <div className="text-center mt-12">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • VOLUNTAS TEAM
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* Minimal Contact Section */}
      <Section background="white" className="py-32">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Index;
