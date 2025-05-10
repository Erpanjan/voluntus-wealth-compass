
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import EventCard from '@/components/EventCard';
import ContactForm from '@/components/ContactForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Event = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        titleKey="hero_title"
        subtitleKey="hero_subtitle"
        collaborationKey="collaboration"
        section="event"
      />

      {/* Upcoming Events */}
      <Section titleKey="upcoming_events" section="event">
        <div className="grid md:grid-cols-2 gap-8">
          <EventCard 
            upcoming={true}
            title={t('financial_workshop', 'event')}
            description={t('financial_workshop_desc', 'event')}
            image="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80"
          />
          <EventCard 
            upcoming={true}
            title={t('investment_webinar', 'event')}
            description={t('investment_webinar_desc', 'event')}
            image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
          />
        </div>
      </Section>

      {/* Previous Events */}
      <Section titleKey="previous_events" section="event" background="light">
        <div className="grid md:grid-cols-2 gap-8">
          <EventCard 
            upcoming={false}
            title={t('market_outlook', 'event')}
            description={t('market_outlook_desc', 'event')}
            image="https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80"
          />
          <EventCard 
            upcoming={false}
            title={t('retirement_seminar', 'event')}
            description={t('retirement_seminar_desc', 'event')}
            image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80"
          />
        </div>
      </Section>

      {/* Contact Form */}
      <Section id="contact">
        <ContactForm />
      </Section>
    </div>
  );
};

export default Event;
