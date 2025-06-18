
import React, { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type SectionData = {
  id: string;
  title: string;
  content: React.ReactNode;
};

interface HorizontalScrollCarouselProps {
  sections: SectionData[];
}

const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ sections }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section
      ref={targetRef}
      className="relative h-[400vh] w-full"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex gap-8 pl-8"
        >
          {sections.map((section) => (
            <Card
              key={section.id}
              section={section}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Card: React.FC<{ section: SectionData }> = ({ section }) => {
  const { t } = useLanguage();

  return (
    <div className="group relative h-[500px] w-[400px] flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-hover transition-all duration-300">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F1F1F1]/30 to-transparent pointer-events-none" />
      
      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Content area */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h3 className="text-2xl font-semibold text-[#333333] tracking-tight leading-tight">
            {section.title}
          </h3>
          <div className="space-y-4 text-[#666666] text-base leading-relaxed">
            {section.content}
          </div>
        </div>
        
        {/* Action area */}
        <div className="mt-6 pt-6 border-t border-[#F1F1F1]">
          <Button 
            asChild 
            size="default"
            className="bg-[#333333] hover:bg-[#555555] text-white transition-all duration-200"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('home.howWeCanHelp')} <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
