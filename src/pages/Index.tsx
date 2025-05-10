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
        <Section id="gambling" background="light" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-6 sm:gap-8 md:gap-16 items-start max-w-3xl mx-auto">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in-up">
              <h2 className={cn(
                "font-semibold text-black tracking-tight text-balance",
                "mobile-heading-md sm:text-xl sm:text-2xl"
              )}>
                Tired of Feeling Like You're Gambling With Your Money?
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-6 text-[#9F9EA1] mobile-body-text sm:text-base lg:text-lg font-light">
                <p className="text-balance">
                  Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.
                </p>
                <p className="text-balance">
                  It is time for a strategic and systematic approach to financial success.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-3 sm:mt-4 md:mt-6 touch-manipulation"
              >
                <Link to="/services" className="inline-flex items-center">
                  How We Can Help <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      )
    },
    {
      id: "complicated",
      title: "Does Managing Your Wealth Have to Be So Complicated and Expensive?",
      background: "light" as const,
      content: (
        <Section id="complicated" background="light" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-6 sm:gap-8 md:gap-16 items-start max-w-3xl mx-auto">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h2 className={cn(
                "font-semibold text-black tracking-tight text-balance",
                "mobile-heading-md sm:text-xl sm:text-2xl"
              )}>
                Does Managing Your Wealth Have to Be So Complicated and Expensive?
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-6 text-[#9F9EA1] mobile-body-text sm:text-base lg:text-lg font-light">
                <p className="text-balance">
                  Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?
                </p>
                <p className="text-balance">
                  Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-3 sm:mt-4 md:mt-6 touch-manipulation"
              >
                <Link to="/services" className="inline-flex items-center">
                  How We Can Help <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      )
    },
    {
      id: "best-interest",
      title: "Can Financial Advice Ever Be in Your Best Interest?",
      background: "light" as const,
      content: (
        <Section id="best-interest" background="light" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-6 sm:gap-8 md:gap-16 items-start max-w-3xl mx-auto">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h2 className={cn(
                "font-semibold text-black tracking-tight text-balance",
                "mobile-heading-md sm:text-xl sm:text-2xl"
              )}>
                Can Financial Advice Ever Be in Your Best Interest?
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-6 text-[#9F9EA1] mobile-body-text sm:text-base lg:text-lg font-light">
                <p className="text-balance">
                  Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.
                </p>
                <p className="text-balance">
                  Commission-based advice is not in your best interest, so we offer a subscription-based service.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-3 sm:mt-4 md:mt-6 touch-manipulation"
              >
                <Link to="/services" className="inline-flex items-center">
                  How We Can Help <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      )
    },
    {
      id: "accountability",
      title: "Does Investing End Once the Product is Purchased?",
      background: "light" as const,
      content: (
        <Section id="accountability" background="light" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-6 sm:gap-8 md:gap-16 items-start max-w-3xl mx-auto">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h2 className={cn(
                "font-semibold text-black tracking-tight text-balance",
                "mobile-heading-md sm:text-xl sm:text-2xl"
              )}>
                Does Investing End Once the Product is Purchased?
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-6 text-[#9F9EA1] mobile-body-text sm:text-base lg:text-lg font-light">
                <p className="text-balance">
                  Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.
                </p>
                <p className="text-balance">
                  Purchasing a product is only the start of the journey, what matters is what comes after the purchase.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-3 sm:mt-4 md:mt-6 touch-manipulation"
              >
                <Link to="/services" className="inline-flex items-center">
                  How We Can Help <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
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
            className="bg-black/80 hover:bg-black text-white transition-all duration-300 touch-manipulation"
          >
            <Link to="/services" className="inline-flex items-center">
              Our Services <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Updated Section with auto height and better mobile sizing */}
      <Section id="how-we-can-help" background="white" className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="h-auto min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px]">
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
