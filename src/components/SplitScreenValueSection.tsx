
import React, { useState, useEffect, useRef } from 'react';
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Set up scroll based content changing
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Calculate progress through the section (0 to 1)
      const sectionProgress = (scrollPosition - sectionTop + viewportHeight * 0.5) / 
        (sectionHeight - viewportHeight);
      
      // Determine which proposition to show based on scroll progress
      const newIndex = Math.min(
        Math.max(
          Math.floor(sectionProgress * propositions.length),
          0
        ),
        propositions.length - 1
      );
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, propositions.length]);
  
  return (
    <section 
      ref={sectionRef}
      className="relative bg-white" 
      style={{ height: `${100 * propositions.length}vh` }}
    >
      {/* Fixed position container */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row">
        {/* Left side with number */}
        <div className="flex-1 bg-[#474646] flex flex-col items-center justify-center py-20">
          <div className="mb-16 text-center">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-2">
              {title}
            </h3>
            <p className="text-xl text-white/70">
              {subtitle}
            </p>
          </div>
          <div className="text-center">
            <span className="text-[12rem] font-light text-white transition-all duration-500">
              {activeIndex + 1}
            </span>
          </div>
        </div>
        
        {/* Right side with content - using a left-aligned content approach */}
        <div className="flex-1 bg-white flex items-center">
          <div className="w-full pl-8 md:pl-16 lg:pl-20 pr-4 md:pr-8 max-w-3xl">
            {propositions.map((proposition, index) => (
              <div
                key={proposition.id}
                ref={el => contentRefs.current[index] = el}
                className={cn(
                  "transition-opacity duration-500 absolute",
                  activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <h3 className="text-3xl font-semibold mb-4">{proposition.title}</h3>
                <p className="text-xl text-gray-500 mb-8">- {proposition.subtitle}</p>
                <p className="text-gray-600">{proposition.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center">
        <div className="flex gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          {propositions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!sectionRef.current) return;
                const sectionTop = sectionRef.current.offsetTop;
                const sectionHeight = sectionRef.current.offsetHeight;
                const targetPosition = sectionTop + (sectionHeight / propositions.length) * index;
                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
                });
              }}
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
