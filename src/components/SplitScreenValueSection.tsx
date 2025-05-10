
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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

// Using memo to prevent unnecessary re-renders
const SplitScreenValueSection = memo(({
  title,
  subtitle,
  propositions
}: SplitScreenValueSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isMobile = useIsMobile();
  
  // Memoized scroll handler with throttling for better performance
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    // Calculate if the section is in view (with improved visibility calculation)
    const isSectionInView = 
      scrollPosition + viewportHeight > sectionTop && 
      scrollPosition < sectionTop + sectionHeight;
    
    // Only update state if necessary to avoid re-renders
    if (isVisible !== isSectionInView) {
      setIsVisible(isSectionInView);
    }
    
    // Only calculate active index if section is visible
    if (isSectionInView) {
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
      
      // Only update state if necessary to avoid re-renders
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  }, [activeIndex, propositions.length, isVisible]);
  
  // Optimize scroll event handling with passive listener and cleanup
  useEffect(() => {
    const throttledScrollHandler = () => {
      // Using requestAnimationFrame for better performance
      window.requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);
  
  // Memoized navigation handler
  const handleNavClick = useCallback((index: number) => {
    if (!sectionRef.current) return;
    
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;
    const targetPosition = sectionTop + (sectionHeight / propositions.length) * index;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }, [propositions.length]);
  
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
          <div className="text-center relative h-[12rem]">
            {propositions.map((_, index) => (
              <span 
                key={`number-${index}`} 
                className={cn(
                  "absolute inset-0 flex items-center justify-center text-[12rem] font-light transition-all duration-500",
                  activeIndex === index 
                    ? "opacity-100 translate-y-0 text-white" 
                    : "opacity-0 translate-y-12 pointer-events-none text-white/30"
                )}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>
        
        {/* Right side with content - optimized for mobile */}
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="w-full mx-auto px-6 md:px-12 lg:px-16 max-w-xl h-full flex items-center">
            <div className="w-full relative h-[350px]">
              {propositions.map((proposition, index) => (
                <div
                  key={proposition.id}
                  ref={el => contentRefs.current[index] = el}
                  className={cn(
                    "absolute top-0 left-0 w-full h-full transition-opacity duration-500",
                    activeIndex === index 
                      ? "opacity-100 z-10" 
                      : "opacity-0 z-0"
                  )}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col">
                      <h3 className="text-3xl font-bold font-inter mb-4">{proposition.title}</h3>
                      <p className="text-xl text-gray-500 mb-8 font-inter font-light">- {proposition.subtitle}</p>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-600 font-inter font-normal">{proposition.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation dots - with performance optimization */}
      {isVisible && (
        <div className="fixed bottom-8 left-0 w-full flex justify-center">
          <div className="flex gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
            {propositions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(index)}
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
      )}
    </section>
  );
});

SplitScreenValueSection.displayName = 'SplitScreenValueSection';

export default SplitScreenValueSection;
