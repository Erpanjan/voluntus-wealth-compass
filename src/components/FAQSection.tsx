
import { memo } from 'react';
import SplitScreenValueSection from '@/components/SplitScreenValueSection';

interface FAQItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

interface FAQSectionProps {
  title: string;
  subtitle: string;
  propositions: FAQItem[];
}

// Memoized FAQ section to prevent unnecessary re-renders
const FAQSection = memo(({ title, subtitle, propositions }: FAQSectionProps) => {
  return (
    <SplitScreenValueSection
      title={title}
      subtitle={subtitle}
      propositions={propositions}
    />
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;
