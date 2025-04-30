import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContentCard from '@/components/ContentCard';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import SectionCarousel from '@/components/SectionCarousel';

const Index = () => {
  // Define the carousel sections
  const carouselSections = [
    {
      id: "gambling",
      title: "Tired of Feeling Like You're Gambling With Your Money?",
      background: "light" as const,
      content: (
        <Section id="gambling" background="light" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-16 items-start max-w-3xl mx-auto pt-16">
            <div className="space-y-8 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black tracking-tight">
                Tired of Feeling Like You're Gambling With Your Money?
              </h2>
              <div className="space-y-6 text-[#9F9EA1] text-lg font-light">
                <p>
                  Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.
                </p>
                <p>
                  It is time for a strategic and systematic approach to financial success.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300 mt-8"
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
      background: "white" as const,
      content: (
        <Section id="complicated" background="white" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-16 items-start max-w-3xl mx-auto pt-16">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black tracking-tight">
                Does Managing Your Wealth Have to Be So Complicated and Expensive?
              </h2>
              <div className="space-y-6 text-[#9F9EA1] text-lg font-light">
                <p>
                  Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?
                </p>
                <p>
                  Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300"
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
          <div className="grid md:grid-cols-1 gap-16 items-start max-w-3xl mx-auto pt-16">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black tracking-tight">
                Can Financial Advice Ever Be in Your Best Interest?
              </h2>
              <div className="space-y-6 text-[#9F9EA1] text-lg font-light">
                <p>
                  Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.
                </p>
                <p>
                  Commission-based advice is not in your best interest, so we offer a subscription-based service.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300"
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
      background: "white" as const,
      content: (
        <Section id="accountability" background="white" carouselItem={true}>
          <div className="grid md:grid-cols-1 gap-16 items-start max-w-3xl mx-auto pt-16">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black tracking-tight">
                Does Investing End Once the Product is Purchased?
              </h2>
              <div className="space-y-6 text-[#9F9EA1] text-lg font-light">
                <p>
                  Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.
                </p>
                <p>
                  Purchasing a product is only the start of the journey, what matters is what comes after the purchase.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300"
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
        subtitle="Personalized investment solutions for your financial journey"
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

      {/* Carousel Sections - now with vertical scrolling */}
      <SectionCarousel sections={carouselSections} />

      {/* Contact Form Section */}
      <Section id="contact" background="light">
        <ContactForm />
      </Section>
    </div>
  );
};

export default Index;
