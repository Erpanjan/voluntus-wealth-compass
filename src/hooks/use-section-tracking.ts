
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseSectionTrackingResult {
  activeSection: number;
  profileSectionRef: RefObject<HTMLDivElement>;
  questionnaireSectionRef: RefObject<HTMLDivElement>;
  consultationSectionRef: RefObject<HTMLDivElement>;
}

export function useSectionTracking(): UseSectionTrackingResult {
  const [activeSection, setActiveSection] = useState(0);
  
  // References to each section for Intersection Observer
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const questionnaireSectionRef = useRef<HTMLDivElement>(null);
  const consultationSectionRef = useRef<HTMLDivElement>(null);
  
  // Setup Intersection Observer for scroll tracking
  useEffect(() => {
    const options = {
      root: null, // Use viewport as root
      rootMargin: '-10% 0px -70% 0px', // Trigger when element is 10% from the top and 30% from the bottom
      threshold: 0 // Trigger when any part of the element is visible
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === profileSectionRef.current) {
            setActiveSection(0);
          } else if (entry.target === questionnaireSectionRef.current) {
            setActiveSection(1);
          } else if (entry.target === consultationSectionRef.current) {
            setActiveSection(2);
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, options);
    
    if (profileSectionRef.current) observer.observe(profileSectionRef.current);
    if (questionnaireSectionRef.current) observer.observe(questionnaireSectionRef.current);
    if (consultationSectionRef.current) observer.observe(consultationSectionRef.current);
    
    return () => {
      if (profileSectionRef.current) observer.unobserve(profileSectionRef.current);
      if (questionnaireSectionRef.current) observer.unobserve(questionnaireSectionRef.current);
      if (consultationSectionRef.current) observer.unobserve(consultationSectionRef.current);
    };
  }, [profileSectionRef.current, questionnaireSectionRef.current, consultationSectionRef.current]);

  return {
    activeSection,
    profileSectionRef,
    questionnaireSectionRef,
    consultationSectionRef
  };
}
