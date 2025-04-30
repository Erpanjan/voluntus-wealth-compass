
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Contact = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Contact Us"
        subtitle="Have questions or ready to start your financial journey? We're here to help."
      />

      {/* Contact Information Section */}
      <Section>
        <div className="grid md:grid-cols-1 gap-12">
          {/* Contact Form */}
          <div className="max-w-2xl mx-auto w-full">
            <ContactForm />
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section title="Frequently Asked Questions" background="light" titleCentered>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-xl shadow-sm overflow-hidden border-none">
              <AccordionTrigger className="px-6 py-5 hover:no-underline font-inter text-lg font-medium">
                How do I get started with Voluntus?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-voluntus-text-secondary font-inter font-light">
                You can get started by filling out our contact form, calling us directly, or scheduling an initial consultation. We'll discuss your financial goals and how we can help you achieve them.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-white rounded-xl shadow-sm overflow-hidden border-none">
              <AccordionTrigger className="px-6 py-5 hover:no-underline font-inter text-lg font-medium">
                What is the minimum investment required?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-voluntus-text-secondary font-inter font-light">
                We work with clients across a wide range of wealth levels. Our subscription-based model focuses on the complexity of your needs rather than the size of your assets.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-white rounded-xl shadow-sm overflow-hidden border-none">
              <AccordionTrigger className="px-6 py-5 hover:no-underline font-inter text-lg font-medium">
                How often will I meet with my advisor?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-voluntus-text-secondary font-inter font-light">
                We offer regular check-ins based on your preferences and needs. Typically, clients meet with their advisors quarterly, but we're always available when market conditions change or when you have important financial decisions to make.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-white rounded-xl shadow-sm overflow-hidden border-none">
              <AccordionTrigger className="px-6 py-5 hover:no-underline font-inter text-lg font-medium">
                Can I cancel my subscription service at any time?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-voluntus-text-secondary font-inter font-light">
                Yes, our subscription model is designed to be flexible. You can adjust or cancel your service as your needs change, though we recommend discussing any changes with your advisor to ensure your financial plan remains on track.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
