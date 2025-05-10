
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContentCard from '@/components/ContentCard';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import SectionCarousel from '@/components/SectionCarousel';
import { cn } from '@/lib/utils';

const Index = () => {
  // Define the carousel sections
  const carouselSections = [
    {
      id: "gambling",
      title: "Tired of Feeling Like You're Gambling With Your Money?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.
          </p>
          <p className="mb-4 mobile-text-base">
            It is time for a strategic and systematic approach to financial success.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    },
    {
      id: "complicated",
      title: "Does Managing Your Wealth Have to Be So Complicated and Expensive?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?
          </p>
          <p className="mb-4 mobile-text-base">
            Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    },
    {
      id: "best-interest",
      title: "Can Financial Advice Ever Be in Your Best Interest?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.
          </p>
          <p className="mb-4 mobile-text-base">
            Commission-based advice is not in your best interest, so we offer a subscription-based service.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    },
    {
      id: "accountability",
      title: "Does Investing End Once the Product is Purchased?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3 mobile-text-base">
            Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.
          </p>
          <p className="mb-4 mobile-text-base">
            Purchasing a product is only the start of the journey, what matters is what comes after the purchase.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-2"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero 
        title="We're There With You Every Step of The Way"
        subtitle="Access professional investment management service through a simple monthly subscription, with reduced costs and service tailored to you."
        background="transparent"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild 
            size="lg"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300"
          >
            <Link to="/services" className="inline-flex items-center">
              Our Services <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Updated Section with auto height */}
      <Section id="how-we-can-help" background="white" className="py-6 md:py-12">
        <div className="w-full">
          <SectionCarousel sections={carouselSections} />
        </div>
      </Section>

      {/* Waitlist Form Section */}
      <Section id="contact" background="light">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Index;
