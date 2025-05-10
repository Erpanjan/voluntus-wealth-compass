
import React from 'react';
import { Plus, Minus } from 'lucide-react';
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
    <section className="py-16 md:py-24">
      <div className="container-custom mx-auto px-6 md:px-8 lg:px-0">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Left side - Title and subtitle */}
          <div className="md:w-2/5 lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{title}</h2>
            <p className="text-gray-500">{subtitle}</p>
          </div>
          
          {/* Right side - Accordion */}
          <div className="md:w-3/5 lg:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {propositions.map((prop) => (
                <AccordionItem 
                  key={prop.id} 
                  value={prop.id}
                  className="border-none bg-[#F2F2F2] rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xl font-semibold mb-1">{prop.title}</span>
                      <span className="text-gray-500 font-light text-sm">{prop.subtitle}</span>
                    </div>
                    <Plus className="h-5 w-5 shrink-0 transition-transform duration-200 data-[state=open]:hidden" />
                    <Minus className="h-5 w-5 shrink-0 transition-transform duration-200 hidden data-[state=open]:block" />
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-0 text-gray-600">
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
