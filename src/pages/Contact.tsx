
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
import SplitScreenValueSection from '@/components/SplitScreenValueSection';

const Contact = () => {
  // FAQ items data
  const faqItems = [
    {
      id: "get-started",
      title: "How do I get started with Voluntus?",
      subtitle: "Initial steps",
      description: "You can get started by filling out our contact form, calling us directly, or scheduling an initial consultation. We'll discuss your financial goals and how we can help you achieve them."
    },
    {
      id: "minimum-investment",
      title: "What is the minimum investment required?",
      subtitle: "Investment requirements",
      description: "We work with clients across a wide range of wealth levels. Our subscription-based model focuses on the complexity of your needs rather than the size of your assets."
    },
    {
      id: "advisor-meetings",
      title: "How often will I meet with my advisor?",
      subtitle: "Meeting frequency",
      description: "We offer regular check-ins based on your preferences and needs. Typically, clients meet with their advisors quarterly, but we're always available when market conditions change or when you have important financial decisions to make."
    },
    {
      id: "cancel-subscription",
      title: "Can I cancel my subscription service at any time?",
      subtitle: "Subscription flexibility",
      description: "Yes, our subscription model is designed to be flexible. You can adjust or cancel your service as your needs change, though we recommend discussing any changes with your advisor to ensure your financial plan remains on track."
    }
  ];

  return <div className="min-h-screen">
      {/* Hero Section */}
      <Hero title="Contact Us" subtitle="Have questions or ready to start your financial journey? We're here to help." />

      {/* Contact Form Section */}
      <Section>
        <div className="grid md:grid-cols-1 gap-12">
          {/* Contact Form */}
          <div className="max-w-2xl mx-auto w-full">
            <ContactForm />
          </div>
        </div>
      </Section>

      {/* FAQ Section - Using SplitScreenValueSection instead of FAQAccordionSection */}
      <SplitScreenValueSection 
        title="Frequently Asked Questions" 
        subtitle="Find answers to our most commonly asked questions" 
        propositions={faqItems}
      />
    </div>;
};
export default Contact;
