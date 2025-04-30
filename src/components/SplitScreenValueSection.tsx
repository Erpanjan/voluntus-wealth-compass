
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ValueCard from './ValueCard';

interface ValueProposition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

interface SplitScreenValueSectionProps {
  title: string;
  subtitle: string;
  propositions: ValueProposition[];
}

const SplitScreenValueSection: React.FC<SplitScreenValueSectionProps> = ({
  title,
  subtitle,
  propositions
}) => {
  const [activeValue, setActiveValue] = useState(0);
  
  return (
    <section className="py-20 bg-white">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">{title}</h2>
          <p className="text-xl text-gray-500">{subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {propositions.map((proposition, index) => (
            <ValueCard 
              key={proposition.id}
              title={proposition.title}
              subtitle={proposition.subtitle}
              description={proposition.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SplitScreenValueSection;
