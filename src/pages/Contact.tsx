
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import WaitlistForm from '@/components/WaitlistForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-white-smoke">
      {/* Hero Section */}
      <Hero 
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        background="white-smoke"
      />

      {/* Waitlist Form Section */}
      <Section id="contact" background="almond">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Contact;
