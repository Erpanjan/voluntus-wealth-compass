
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
      <Section id="contact">
        <WaitlistForm />
      </Section>
    </div>
  );
};

export default Contact;
