import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';

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
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">How do I get started with Voluntus?</h3>
            <p className="text-voluntus-text-secondary">
              You can get started by filling out our contact form, calling us directly, or scheduling an initial consultation. We'll discuss your financial goals and how we can help you achieve them.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">What is the minimum investment required?</h3>
            <p className="text-voluntus-text-secondary">
              We work with clients across a wide range of wealth levels. Our subscription-based model focuses on the complexity of your needs rather than the size of your assets.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">How often will I meet with my advisor?</h3>
            <p className="text-voluntus-text-secondary">
              We offer regular check-ins based on your preferences and needs. Typically, clients meet with their advisors quarterly, but we're always available when market conditions change or when you have important financial decisions to make.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription service at any time?</h3>
            <p className="text-voluntus-text-secondary">
              Yes, our subscription model is designed to be flexible. You can adjust or cancel your service as your needs change, though we recommend discussing any changes with your advisor to ensure your financial plan remains on track.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
