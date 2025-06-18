
import { useState, useEffect } from 'react';
import { isScrolled } from '@/utils/headerUtils';

export const useScrollState = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(isScrolled());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
};
