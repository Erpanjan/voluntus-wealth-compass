
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import InteractiveServiceGrid from '@/components/InteractiveServiceGrid';
import TabContent from '@/components/TabContent';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  // Services data
  const serviceItems = [
    {
      id: 'investment',
      title: 'Investment Solution',
      content: "Many believe building a diversified investment portfolio requires substantial wealth and expertise, limiting it to high-net-worth individuals—but this isn't true. Our Financial Planning Policy provides personalized investment strategies offering effective global diversification, empowering clients to navigate market volatility confidently. Moreover, our portfolios are designed to be cost-effective, lowering upfront investment expenses. Regular updates ensure the strategies remain aligned with each client's evolving goals and market conditions, maintaining a robust financial plan aimed at achieving long-term success."
    },
    {
      id: 'advisor',
      title: 'Dedicated Advisor',
      content: "Every client is paired with a dedicated financial advisor who not only executes the policy but regularly refines your Financial Planning Policy based on market condition and your circumstances. Through proactive, insightful communication, they keep you informed and empowered—ensuring you feel confident in every investment decision you make."
    },
    {
      id: 'risk',
      title: 'Risk Management',
      content: "With our strong quantitative skills and deep investment expertise, we manage risk across multiple dimensions. Through vigilant, ongoing oversight, we ensure your investments stay aligned with your evolving financial circumstances and remain positioned to achieve your goals—delivering peace of mind and confidence in your investment journey."
    },
    {
      id: 'policy',
      title: 'Policy Keeping',
      content: "Your Financial Planning Policy adapts to shifting market conditions and your personal life changes, meticulously tracking all advice given and decisions made. This flexible, proactive approach brings clarity to uncertain times, keeping your investment strategy both resilient and relevant."
    },
  ];

  // Value propositions
  const valuePropositions = [
    {
      id: "control",
      label: "We give you control",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">We give you control</h3>
          <p className="text-sm text-gray-600 mb-3">- over your wealth, decisions, and outcomes.</p>
          <p className="text-black/80 leading-relaxed">
            By placing the financial planning policy at the center of our service, we empower clients with direct control over the rules, processes, and the outcome.
          </p>
        </div>
      )
    },
    {
      id: "fiduciary",
      label: "We bear fiduciary Duty",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">We bear fiduciary Duty</h3>
          <p className="text-sm text-gray-600 mb-3">- with a transparent governance</p>
          <p className="text-black/80 leading-relaxed">
            We uphold a fiduciary duty to act in the client's best interest. This commitment is reflected in a clear plan that outlines all rules, including legal accountability. Importantly, we do not accept commissions from third party, this ensures that our interests remain aligned.
          </p>
        </div>
      )
    },
    {
      id: "simplicity",
      label: "We value simplicity",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">We value simplicity</h3>
          <p className="text-sm text-gray-600 mb-3">- over complexity</p>
          <p className="text-black/80 leading-relaxed">
            We aim to keep the policy and investment strategy simple. This simplicity enables client to have a clearer understanding of their investments, fostering greater confidence and maintain a healthy expectation for the outcomes. Overly complex investment strategies often yield marginal benefits at the expense of clarity and transparency.
          </p>
        </div>
      )
    },
    {
      id: "accountability",
      label: "We take accountability",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">We take accountability</h3>
          <p className="text-sm text-gray-600 mb-3">- over every advice we share</p>
          <p className="text-black/80 leading-relaxed">
            We take accountability by making all the advice we share measurable. At the conclusion of the policy, we will revisit all advice provided, taking responsibility and being incentivized based on the outcomes. This approach reinforces our commitment to the client's success and ensures full accountability for our actions.
          </p>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="A Financial Policy That Guides You From Start to End"
      />

      {/* Roadmap Section */}
      <Section id="roadmap" background="dark">
        <div className="grid md:grid-cols-1 gap-8 items-start max-w-3xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              A Roadmap for your Investment Journey
            </h2>
            <div className="space-y-6 text-white/70 text-lg font-light">
              <p>
                The Financial Planning Policy is a personalized roadmap for managing your wealth. It outlines how your funds should be allocated to kick-start your investment journey, providing step-by-step guidance along with ongoing monitoring and plan governance.
              </p>
              <p>
                It also defines our roles and responsibilities throughout this process, ensuring the policy remains up-to-date and that you're never alone on your journey to reach your financial goals.
              </p>
            </div>
            <Button 
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
            >
              <Link to="/contact" className="inline-flex items-center">
                Request a demo <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* What's Included Section - More prominent now */}
      <Section 
        id="whats-included" 
        title="What's included in our service?" 
        background="white" 
        titleClassName="text-4xl md:text-5xl font-medium tracking-tight mb-12"
        className="py-16 md:py-24"
      >
        <div className="w-full mx-auto">
          <InteractiveServiceGrid services={serviceItems} />
        </div>
      </Section>

      {/* Value Propositions with Tab Navigation */}
      <Section 
        id="principles" 
        title="Our Value Propositions" 
        subtitle="What sets us apart" 
        titleCentered
        background="light"
      >
        <TabContent tabs={valuePropositions} />
      </Section>

      {/* Pricing Section */}
      <Section id="policy-fee" title="Our Pricing" background="light" titleCentered>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-voluntus-text-secondary">
            This is a subscription service with policy fee is charged periodically, with the amount depending on the complexity of your financial needs and the duration of the policy.
          </p>
          <p className="text-voluntus-text-secondary">
            We DO NOT charge based on investment vehicle selected or size of the investment.
          </p>
          <div className="mt-8">
            <Button
              asChild 
              size="lg"
              className="bg-black/80 hover:bg-black text-white transition-all duration-300"
            >
              <Link to="/contact" className="inline-flex items-center">
                Request pricing information <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Contact Form */}
      <Section id="contact">
        <ContactForm />
      </Section>
    </div>
  );
};

export default Services;
