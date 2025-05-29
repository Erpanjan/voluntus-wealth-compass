
import { useEffect } from 'react';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export const useDynamicMetaTags = (config: MetaTagsConfig) => {
  useEffect(() => {
    const originalTitle = document.title;
    const originalMetaTags: { [key: string]: string } = {};

    // Store original meta tag values
    const metaSelectors = [
      'meta[property="og:title"]',
      'meta[property="og:description"]', 
      'meta[property="og:image"]',
      'meta[property="og:type"]',
      'meta[name="twitter:image"]',
      'meta[name="description"]'
    ];

    metaSelectors.forEach(selector => {
      const element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        originalMetaTags[selector] = element.content;
      }
    });

    // Update document title
    if (config.title) {
      document.title = config.title;
    }

    // Update meta tags
    const updateMetaTag = (selector: string, content: string | undefined) => {
      const element = document.querySelector(selector) as HTMLMetaElement;
      if (element && content !== undefined) {
        element.content = content;
      }
    };

    updateMetaTag('meta[property="og:title"]', config.title);
    updateMetaTag('meta[property="og:description"]', config.description || '');
    updateMetaTag('meta[property="og:image"]', config.image);
    updateMetaTag('meta[property="og:type"]', config.type || 'article');
    updateMetaTag('meta[name="twitter:image"]', config.image);
    updateMetaTag('meta[name="description"]', config.description || '');

    // Cleanup function to restore original values
    return () => {
      document.title = originalTitle;
      
      Object.entries(originalMetaTags).forEach(([selector, originalContent]) => {
        const element = document.querySelector(selector) as HTMLMetaElement;
        if (element) {
          element.content = originalContent;
        }
      });
    };
  }, [config.title, config.description, config.image, config.type]);
};
