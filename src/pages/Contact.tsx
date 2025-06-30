
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-minimal Hero */}
      <Hero 
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        background="white"
      />

      {/* Editorial Contact Section */}
      <Section background="white" className="py-32">
        <div className="max-w-5xl mx-auto">
          {/* Large featured image */}
          <div className="editorial-spacing">
            <img 
              src="https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=80&w=1200&h=600"
              alt="Contact Us"
              className="editorial-image w-full h-[400px] md:h-[600px] object-cover"
            />
          </div>
          
          {/* Editorial content */}
          <div className="max-w-3xl mx-auto text-center editorial-spacing">
            <h3 className="text-2xl md:text-4xl font-light tracking-wide mb-8 leading-tight">
              Get In Touch
            </h3>
            <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed">
              Ready to begin your financial journey with us? Join our waitlist to be among the first to experience our revolutionary approach to wealth management.
            </p>
          </div>
        </div>
      </Section>

      {/* Minimal Waitlist Form */}
      <Section background="white" className="py-16">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Contact;
