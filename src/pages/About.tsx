
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';

const About = () => {
  return <div className="min-h-screen">
      {/* Hero Section */}
      <Hero title="About Us" subtitle="We are a Hong Kong-based wealth advisory firm dedicated to helping households secure their financial future through tailored investment planning" />

      {/* Vision Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl leading-tight text-zinc-800 text-left py-0 mx-[24px] px-0 font-light lg:text-5xl">
            We envision a world where finance truly empowering people to flourish in life.
          </h2>
        </div>
      </Section>

      {/* Waitlist Form */}
      <Section id="contact" background="light">
        <WaitlistForm />
      </Section>
    </div>;
};
export default About;
