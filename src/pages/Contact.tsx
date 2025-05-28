
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />

      {/* Waitlist Form Section */}
      <Section>
        <div className="grid md:grid-cols-1 gap-12">
          {/* Waitlist Form */}
          <div className="max-w-2xl mx-auto w-full">
            <WaitlistForm />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
