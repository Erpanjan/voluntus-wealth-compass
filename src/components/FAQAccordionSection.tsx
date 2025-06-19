
import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface ValueProposition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

interface FAQAccordionSectionProps {
  title: string;
  subtitle: string;
  propositions: ValueProposition[];
}

const FAQAccordionSection: React.FC<FAQAccordionSectionProps> = ({
  title,
  subtitle,
  propositions
}) => {
  return (
    <section className="min-h-[70vh] md:min-h-screen flex flex-col justify-center bg-brand-white-smoke py-8 sm:py-10 md:py-16">
      <div className="container-custom mx-auto px-6 md:px-8 lg:px-0">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Left side - Title and subtitle */}
          <div className="md:w-2/5 lg:w-1/3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-brand-black-olive">{title}</h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-gray">{subtitle}</p>
          </div>
          
          {/* Right side - Accordion */}
          <div className="md:w-3/5 lg:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {propositions.map((prop, index) => (
                <AccordionItem 
                  key={prop.id} 
                  value={prop.id}
                  className="border-none bg-brand-almond rounded-xl overflow-hidden shadow-brand border border-brand-silver/20"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-brand-almond/80 transition-colors duration-200">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xl font-semibold mb-1 text-brand-black-olive">{prop.title}</span>
                      <span className="text-brand-gray font-light text-sm">{prop.subtitle}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-0 text-base leading-relaxed text-brand-gray">
                    {prop.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordionSection;
