import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';

const About = () => {
  return <div className="min-h-screen">
      {/* Hero Section */}
      <Hero title="About Us" subtitle="We are a Hong Kong-based wealth advisory firm dedicated to helping households secure their financial future through tailored investment planning" />

      {/* Team Section */}
      <Section title="Our Team" background="light" titleCentered>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="text-center">
            <div className="aspect-square rounded-full overflow-hidden w-40 h-40 mx-auto mb-6">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-xl mb-1">John Wei</h3>
            <p className="text-voluntus-text-secondary mb-3">Founder & CEO</p>
            <p className="text-voluntus-text-secondary">
              With over 15 years of experience in wealth management, John brings a wealth of knowledge and insight to help clients achieve their financial goals.
            </p>
          </div>
          
          {/* Team Member 2 */}
          <div className="text-center">
            <div className="aspect-square rounded-full overflow-hidden w-40 h-40 mx-auto mb-6">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-xl mb-1">Sarah Chen</h3>
            <p className="text-voluntus-text-secondary mb-3">Chief Investment Officer</p>
            <p className="text-voluntus-text-secondary">
              Sarah specializes in developing tailored investment strategies that align with clients' long-term financial aspirations and risk tolerance.
            </p>
          </div>
          
          {/* Team Member 3 */}
          <div className="text-center">
            <div className="aspect-square rounded-full overflow-hidden w-40 h-40 mx-auto mb-6">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-xl mb-1">David Lam</h3>
            <p className="text-voluntus-text-secondary mb-3">Senior Financial Advisor</p>
            <p className="text-voluntus-text-secondary">
              David works closely with clients to understand their unique needs and helps them navigate complex financial decisions with confidence.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="btn btn-primary">
            Meet our full team
          </Button>
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
