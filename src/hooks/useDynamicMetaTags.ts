
import { useEffect } from 'react';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

const getAbsoluteUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  // Convert relative URLs to absolute URLs using the current domain
  const baseUrl = window.location.origin;
  return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
};

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
      'meta[property="og:url"]',
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

    // Convert image URL to absolute if provided
    const absoluteImageUrl = config.image ? getAbsoluteUrl(config.image) : undefined;

    updateMetaTag('meta[property="og:title"]', config.title);
    updateMetaTag('meta[property="og:description"]', config.description || '');
    updateMetaTag('meta[property="og:image"]', absoluteImageUrl);
    updateMetaTag('meta[property="og:type"]', config.type || 'article');
    updateMetaTag('meta[property="og:url"]', window.location.href);
    updateMetaTag('meta[name="twitter:image"]', absoluteImageUrl);
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
