
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContentCard from '@/components/ContentCard';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="We're There With You Every Step of The Way"
      >
        <Button asChild className="btn btn-primary">
          <Link to="/services">
            Our Services <ArrowRight size={16} className="ml-1" />
          </Link>
        </Button>
      </Hero>

      {/* Gambling Section */}
      <Section id="gambling" background="light">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Tired of Feeling Like You're Gambling With Your Money?
            </h2>
            <div className="space-y-4 text-voluntus-text-secondary">
              <p>
                Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.
              </p>
              <p>
                It is time for a strategic and systematic approach to financial success.
              </p>
            </div>
            <Button asChild className="btn btn-primary mt-8">
              <Link to="/services">
                HOW WE CAN HELP YOU→
              </Link>
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?auto=format&fit=crop&q=80" 
              alt="Financial planning" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Complicated Section */}
      <Section id="complicated">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80" 
              alt="Complex financial charts" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Does Managing Your Wealth Have to Be So Complicated and Expensive?
            </h2>
            <div className="space-y-4 text-voluntus-text-secondary">
              <p>
                Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?
              </p>
              <p>
                Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.
              </p>
            </div>
            <Button asChild className="btn btn-primary mt-8">
              <Link to="/services">
                HOW WE CAN HELP YOU→
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Best Interest Section */}
      <Section id="best-interest" background="light">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Can Financial Advice Ever Be in Your Best Interest?
            </h2>
            <div className="space-y-4 text-voluntus-text-secondary">
              <p>
                Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.
              </p>
              <p>
                Commission-based advice is not in your best interest, so we offer a subscription-based service.
              </p>
            </div>
            <Button asChild className="btn btn-primary mt-8">
              <Link to="/services">
                HOW WE CAN HELP YOU→
              </Link>
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&q=80" 
              alt="Financial advisor" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Accountability Section */}
      <Section id="accountability">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80" 
              alt="Investment journey" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Does Investing End Once the Product is Purchased?
            </h2>
            <div className="space-y-4 text-voluntus-text-secondary">
              <p>
                Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.
              </p>
              <p>
                Purchasing a product is only the start of the journey, what matters is what comes after the purchase.
              </p>
            </div>
            <Button asChild className="btn btn-primary mt-8">
              <Link to="/services">
                HOW WE CAN HELP YOU→
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section id="contact" background="light">
        <ContactForm />
      </Section>
    </div>
  );
};

export default Index;
