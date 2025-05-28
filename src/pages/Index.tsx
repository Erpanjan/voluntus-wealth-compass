
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';
import InteractiveContainerSection from '@/components/InteractiveContainerSection';

const Index = () => {
  // Define the interactive container sections with adjusted paragraph text sizes
  const containerSections = [
    {
      id: "gambling",
      title: "Tired of Feeling Like You're Gambling With Your Money?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3">
            Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.
          </p>
          <p>
            It is time for a strategic and systematic approach to financial success.
          </p>
        </>
      )
    },
    {
      id: "complicated",
      title: "Does Managing Your Wealth Have to Be So Complicated and Expensive?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3">
            Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?
          </p>
          <p>
            Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.
          </p>
        </>
      )
    },
    {
      id: "best-interest",
      title: "Can Financial Advice Ever Be in Your Best Interest?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3">
            Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.
          </p>
          <p>
            Commission-based advice is not in your best interest, so we offer a subscription-based service.
          </p>
        </>
      )
    },
    {
      id: "accountability",
      title: "Does Investing End Once the Product is Purchased?",
      background: "light" as const,
      content: (
        <>
          <p className="mb-3">
            Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.
          </p>
          <p>
            Purchasing a product is only the start of the journey, what matters is what comes after the purchase.
          </p>
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

      {/* Interactive Container Section */}
      <Section id="how-we-can-help" background="white" className="py-16 md:py-20">
        <div className="w-full">
          <InteractiveContainerSection sections={containerSections} />
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
