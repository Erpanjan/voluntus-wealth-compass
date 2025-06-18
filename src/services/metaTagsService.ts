
interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

interface MetaTagElement {
  selector: string;
  content: string;
}

/**
 * Converts relative URLs to absolute URLs
 */
const getAbsoluteUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  const baseUrl = window.location.origin;
  return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
};

/**
 * Meta tag selectors for different types of meta tags
 */
const META_SELECTORS = [
  'meta[property="og:title"]',
  'meta[property="og:description"]', 
  'meta[property="og:image"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[name="twitter:image"]',
  'meta[name="description"]'
] as const;

/**
 * Updates a single meta tag element
 */
const updateMetaTag = (selector: string, content: string | undefined): void => {
  const element = document.querySelector(selector) as HTMLMetaElement;
  if (element && content !== undefined) {
    element.content = content;
  }
};

/**
 * Stores original meta tag values for restoration
 */
const storeOriginalMetaTags = (): { [key: string]: string } => {
  const originalMetaTags: { [key: string]: string } = {};
  
  META_SELECTORS.forEach(selector => {
    const element = document.querySelector(selector) as HTMLMetaElement;
    if (element) {
      originalMetaTags[selector] = element.content;
    }
  });
  
  return originalMetaTags;
};

/**
 * Restores original meta tag values
 */
const restoreOriginalMetaTags = (originalMetaTags: { [key: string]: string }): void => {
  Object.entries(originalMetaTags).forEach(([selector, originalContent]) => {
    const element = document.querySelector(selector) as HTMLMetaElement;
    if (element) {
      element.content = originalContent;
    }
  });
};

/**
 * Updates meta tags with new configuration
 */
const updateMetaTags = (config: MetaTagsConfig): void => {
  const absoluteImageUrl = config.image ? getAbsoluteUrl(config.image) : undefined;

  updateMetaTag('meta[property="og:title"]', config.title);
  updateMetaTag('meta[property="og:description"]', config.description || '');
  updateMetaTag('meta[property="og:image"]', absoluteImageUrl);
  updateMetaTag('meta[property="og:type"]', config.type || 'article');
  updateMetaTag('meta[property="og:url"]', window.location.href);
  updateMetaTag('meta[name="twitter:image"]', absoluteImageUrl);
  updateMetaTag('meta[name="description"]', config.description || '');
};

/**
 * Meta tags service for managing dynamic meta tags
 */
export const metaTagsService = {
  getAbsoluteUrl,
  storeOriginalMetaTags,
  restoreOriginalMetaTags,
  updateMetaTags,
  updateTitle: (title: string): string => {
    const originalTitle = document.title;
    document.title = title;
    return originalTitle;
  },
  restoreTitle: (originalTitle: string): void => {
    document.title = originalTitle;
  }
};
