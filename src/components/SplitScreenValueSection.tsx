
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [refs, setRefs] = useState<Array<React.RefObject<HTMLDivElement>>>([]);
  
  // Create refs for each section
  useEffect(() => {
    setRefs(propositions.map(() => React.createRef<HTMLDivElement>()));
  }, [propositions.length]);
  
  // Set up intersection observers for each section
  useEffect(() => {
    if (refs.length === 0) return;
    
    const observers = refs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.6 } // Trigger when 60% of the element is visible
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return observer;
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [refs]);
  
  return (
    <section className="bg-white">
      {/* Propositions with split screen design */}
      {propositions.map((proposition, index) => (
        <div
          key={proposition.id}
          ref={refs[index]}
          className="min-h-[80vh] flex flex-col md:flex-row"
        >
          {/* Left side with number and title */}
          <div className="flex-1 bg-[#474646] flex flex-col items-center justify-center py-20">
            {index === 0 && (
              <div className="mb-16 text-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-2">
                  Our Value Propositions
                </h3>
                <p className="text-xl text-white/70">
                  What sets us apart
                </p>
              </div>
            )}
            <div className="text-center">
              <span className="text-[12rem] font-light text-white">
                {index + 1}
              </span>
            </div>
          </div>
          
          {/* Right side with content */}
          <div className="flex-1 bg-white flex items-center justify-center p-12">
            <div className="max-w-lg">
              <h3 className="text-3xl font-semibold mb-4">{proposition.title}</h3>
              <p className="text-xl text-gray-500 mb-8">- {proposition.subtitle}</p>
              <p className="text-gray-600">{proposition.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="sticky bottom-8 left-0 w-full flex justify-center mb-8">
        <div className="flex gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          {propositions.map((_, index) => (
            <button
              key={index}
              onClick={() => refs[index]?.current?.scrollIntoView({ behavior: 'smooth' })}
              className={cn(
                "w-2.5 h-2.5 rounded-full p-0 transition-all duration-300 ease-in-out",
                activeIndex === index 
                  ? "bg-black w-8" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to proposition ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SplitScreenValueSection;
