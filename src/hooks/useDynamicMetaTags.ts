
import { useEffect } from 'react';
import { metaTagsService } from '@/services/metaTagsService';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export const useDynamicMetaTags = (config: MetaTagsConfig) => {
  useEffect(() => {
    // Store original values
    const originalTitle = config.title ? metaTagsService.updateTitle(config.title) : document.title;
    const originalMetaTags = metaTagsService.storeOriginalMetaTags();

    // Update meta tags with new configuration
    metaTagsService.updateMetaTags(config);

    // Cleanup function to restore original values
    return () => {
      metaTagsService.restoreTitle(originalTitle);
      metaTagsService.restoreOriginalMetaTags(originalMetaTags);
    };
  }, [config.title, config.description, config.image, config.type]);
};
