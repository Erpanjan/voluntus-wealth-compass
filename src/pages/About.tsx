
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
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

      {/* Our Approach Section */}
      <Section title="Our Approach" titleCentered>
        <div className="max-w-3xl mx-auto">
          <p className="text-voluntus-text-secondary text-lg text-center mb-8">
            At Voluntus Long-term Capital, we believe that wealth management should be transparent, accountable, and tailored to your unique needs.
          </p>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Client-Centered Philosophy</h3>
              <p className="text-voluntus-text-secondary">
                We place your interests at the center of everything we do. Our subscription-based model eliminates conflicts of interest that often arise from commission-based advice, ensuring that our recommendations are always aligned with your financial goals.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Long-Term Partnership</h3>
              <p className="text-voluntus-text-secondary">
                We view wealth management as a journey, not a transaction. Our advisors work with you continuously, adjusting strategies as market conditions change and as your life evolves, ensuring your financial plan remains relevant and effective.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Clarity and Simplicity</h3>
              <p className="text-voluntus-text-secondary">
                We demystify complex financial concepts, providing you with clear explanations and straightforward strategies. This approach empowers you to make informed decisions about your wealth with confidence.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Form */}
      <Section id="contact" background="light">
        <ContactForm />
      </Section>
    </div>;
};
export default About;
