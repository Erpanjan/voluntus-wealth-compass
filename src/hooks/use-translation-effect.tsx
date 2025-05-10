
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * A hook that updates translation text for elements with data-lang-key attributes
 */
export const useTranslationEffect = () => {
  const { t, language } = useLanguage();
  const prevLangRef = useRef(language);
  
  // Update translations when language changes
  useEffect(() => {
    // Only run if language has changed
    if (prevLangRef.current === language) return;
    
    prevLangRef.current = language;
    
    // Find all elements with data-lang-key attribute
    const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
    
    elementsToTranslate.forEach(element => {
      const key = element.getAttribute('data-lang-key');
      const section = element.getAttribute('data-section') || 'common';
      
      if (key) {
        element.textContent = t(key, section);
      }
    });
  }, [language, t]);
  
  return null;
};

// Helper component for translating dynamic text
export const TranslationUpdater = () => {
  useTranslationEffect();
  return null;
};
