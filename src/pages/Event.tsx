
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import EventCard from '@/components/EventCard';
import ContactForm from '@/components/ContactForm';

const Event = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Our Community"
        subtitle="A community where you can connect with others, exchange ideas, and enjoy meaningful conversations."
        collaboration="A collaberation with Besties"
      />

      {/* Upcoming Events */}
      <Section title="Upcoming Events">
        <div className="grid md:grid-cols-2 gap-8">
          <EventCard 
            upcoming={true}
            title="Financial Planning Workshop"
            description="Join us for an interactive workshop on creating sustainable financial plans that adapt to changing market conditions."
            image="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80"
          />
          <EventCard 
            upcoming={true}
            title="Investment Strategy Webinar"
            description="Learn about emerging investment opportunities and how to position your portfolio for long-term growth."
            image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
          />
        </div>
      </Section>

      {/* Previous Events */}
      <Section title="Previous Events" background="light">
        <div className="grid md:grid-cols-2 gap-8">
          <EventCard 
            upcoming={false}
            title="Market Outlook 2025"
            description="Our annual event discussing economic trends and investment strategies for the coming year."
            image="https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80"
          />
          <EventCard 
            upcoming={false}
            title="Retirement Planning Seminar"
            description="A comprehensive seminar on building and maintaining wealth through retirement."
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
