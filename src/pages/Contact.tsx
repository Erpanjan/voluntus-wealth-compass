
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

      {/* Contact Form Section */}
      <Section>
        <div className="grid md:grid-cols-1 gap-12">
          {/* Contact Form */}
          <div className="max-w-2xl mx-auto w-full">
            <ContactForm />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
