
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Contact Us"
        subtitle="Have questions or ready to start your financial journey? We're here to help."
        background="transparent"
      />

      {/* Contact Information Section */}
      <Section background="white">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
          
          {/* Contact Information */}
          <div className="bg-[#F1F1F1] rounded-3xl p-8 shadow-soft">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                  <Mail className="text-[#9F9EA1]" size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-[#9F9EA1] font-light">info@voluntus-capital.com</p>
                  <p className="text-[#9F9EA1] font-light">support@voluntus-capital.com</p>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                  <Phone className="text-[#9F9EA1]" size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p className="text-[#9F9EA1] font-light">+852 1234 5678</p>
                  <p className="text-[#9F9EA1] font-light">Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              {/* Office */}
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                  <MapPin className="text-[#9F9EA1]" size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Office</h3>
                  <p className="text-[#9F9EA1] font-light">
                    123 Finance Street<br />
                    Central District<br />
                    Hong Kong
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map (placeholder) */}
            <div className="mt-8 rounded-lg overflow-hidden h-64 bg-white shadow-sm">
              {/* Embed map here */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#9F9EA1] font-light">Map Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section title="Frequently Asked Questions" background="light" titleCentered>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-hover transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">How do I get started with Voluntus?</h3>
            <p className="text-[#9F9EA1] font-light">
              You can get started by filling out our contact form, calling us directly, or scheduling an initial consultation. We'll discuss your financial goals and how we can help you achieve them.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-hover transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">What is the minimum investment required?</h3>
            <p className="text-[#9F9EA1] font-light">
              We work with clients across a wide range of wealth levels. Our subscription-based model focuses on the complexity of your needs rather than the size of your assets.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-hover transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">How often will I meet with my advisor?</h3>
            <p className="text-[#9F9EA1] font-light">
              We offer regular check-ins based on your preferences and needs. Typically, clients meet with their advisors quarterly, but we're always available when market conditions change or when you have important financial decisions to make.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-hover transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription service at any time?</h3>
            <p className="text-[#9F9EA1] font-light">
              Yes, our subscription model is designed to be flexible. You can adjust or cancel your service as your needs change, though we recommend discussing any changes with your advisor to ensure your financial plan remains on track.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
