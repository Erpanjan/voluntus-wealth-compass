
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ServiceTabs from '@/components/ServiceTabs';
import WaitlistForm from '@/components/WaitlistForm';
import FAQAccordionSection from '@/components/FAQAccordionSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICE_ITEMS, VALUE_PROPOSITION_ITEMS } from '@/constants/servicesData';

const Services = () => {
  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section */}
      <Hero 
        title="A Financial Policy That Guides You From Start to End"
      />

      {/* Roadmap Section */}
      <Section id="roadmap" background="dark">
        <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-start max-w-3xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              A Roadmap for your Investment Journey
            </h2>
            <div className="space-y-4 sm:space-y-6 text-white/70 text-base sm:text-lg font-light">
              <p className="mobile-text-base">
                The Financial Planning Policy is a personalized roadmap for managing your wealth. It outlines how your funds should be allocated to kick-start your investment journey, providing step-by-step guidance along with ongoing monitoring and plan governance.
              </p>
              <p className="mobile-text-base">
                It also defines our roles and responsibilities throughout this process, ensuring the policy remains up-to-date and that you're never alone on your journey to reach your financial goals.
              </p>
            </div>
            <Button 
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="#contact" className="inline-flex items-center">
                Join the Waitlist <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* What's Included Section - Updated to match FAQ section height */}
      <Section 
        id="whats-included" 
        title="What's Included" 
        background="white"
        matchFAQHeight={true}
      >
        <div className="w-full">
          <ServiceTabs services={SERVICE_ITEMS} />
        </div>
      </Section>

      {/* Value Propositions - Replace with FAQAccordionSection */}
      <div id="principles">
        <FAQAccordionSection 
          title="Why Choose Us" 
          subtitle="What sets us apart" 
          propositions={VALUE_PROPOSITION_ITEMS}
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
              Our Pricing
            </h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg font-light text-white/70">
              <p className="mobile-text-base">
                This is a subscription service with policy fee is charged periodically, with the amount depending on the complexity of your financial needs and the duration of the policy.
              </p>
              <p className="mobile-text-base">
                We <span className="font-normal">DO NOT</span> charge based on investment vehicle selected or size of the investment.
              </p>
            </div>
            <Button
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="#contact" className="inline-flex items-center">
                Join the Waitlist <ArrowRight size={18} className="ml-2" />
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
