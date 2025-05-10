import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import FeatureCardGrid from '@/components/FeatureCardGrid';
import TabContent from '@/components/TabContent';
import ContactForm from '@/components/ContactForm';
import SplitScreenValueSection from '@/components/SplitScreenValueSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  // Services data
  const serviceItems = [
    {
      id: 'investment',
      title: 'Investment Solution',
      content: "Many believe building a diversified investment portfolio requires substantial wealth and expertise, limiting it to a small set of investors—but this isn't true. Our Financial Planning Policy provides personalized investment strategies offering effective global diversification, empowering clients to navigate market volatility confidently. Moreover, our portfolios are designed to be cost-effective, lowering upfront investment expenses. Regular updates ensure the strategies remain aligned with each client's evolving goals and market conditions, maintaining a robust financial plan aimed at achieving long-term success."
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
  const valuePropositionItems = [
    {
      id: "control",
      title: "We give you control",
      subtitle: "over your wealth, decisions, and outcomes.",
      description: "By placing the financial planning policy at the center of our service, we empower clients with direct control over the rules, processes, and the outcome."
    },
    {
      id: "fiduciary",
      title: "We bear fiduciary Duty",
      subtitle: "with a transparent governance",
      description: "We uphold a fiduciary duty to act in the client's best interest. This commitment is reflected in a clear plan that outlines all rules, including legal accountability. Importantly, we do not accept commissions from third party, this ensures that our interests remain aligned."
    },
    {
      id: "simplicity",
      title: "We value simplicity",
      subtitle: "over complexity",
      description: "We aim to keep the policy and investment strategy simple. This simplicity enables client to have a clearer understanding of their investments, fostering greater confidence and maintain a healthy expectation for the outcomes. Overly complex investment strategies often yield marginal benefits at the expense of clarity and transparency."
    },
    {
      id: "accountability",
      title: "We take accountability",
      subtitle: "over every advice we share",
      description: "We take accountability by making all the advice we share measurable. At the conclusion of the policy, we will revisit all advice provided, taking responsibility and being incentivized based on the outcomes. This approach reinforces our commitment to the client's success and ensures full accountability for our actions."
    },
  ];

  return (
    <div className="min-h-screen font-inter">
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

      {/* What's Included Section - Updated to use FeatureCardGrid */}
      <Section id="whats-included" title="What's included?" background="white">
        <div className="w-full">
          <FeatureCardGrid services={serviceItems} />
        </div>
      </Section>

      {/* Value Propositions - Using the new SplitScreenValueSection component */}
      <div id="principles">
        <SplitScreenValueSection 
          title="Our Value Propositions" 
          subtitle="What sets us apart" 
          propositions={valuePropositionItems}
        />
      </div>

      {/* Pricing Section */}
      <Section 
        id="policy-fee" 
        background="dark"
      >
        <div className="grid md:grid-cols-1 gap-8 items-start max-w-3xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
              Our Pricing
            </h2>
            <div className="space-y-6 text-lg font-light text-white/70">
              <p>
                This is a subscription service with policy fee is charged periodically, with the amount depending on the complexity of your financial needs and the duration of the policy.
              </p>
              <p>
                We <span className="font-normal">DO NOT</span> charge based on investment vehicle selected or size of the investment.
              </p>
            </div>
            <Button
              asChild 
              size="lg"
              className="bg-white hover:bg-white/90 text-black transition-all duration-300"
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
