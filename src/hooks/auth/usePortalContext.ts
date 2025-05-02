
import { useState, useEffect } from 'react';

export type PortalType = 'admin' | 'client';

export const usePortalContext = (initialPortal?: PortalType) => {
  // Get initial portal type from localStorage or use the provided default
  const [portalType, setPortalType] = useState<PortalType>(() => {
    const storedPortal = localStorage.getItem('portalContext');
    if (storedPortal === 'admin' || storedPortal === 'client') {
      return storedPortal;
    }
    return initialPortal || 'client';
  });

  // Save portal type to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portalContext', portalType);
  }, [portalType]);

  // Function to switch between portals
  const switchToPortal = (portal: PortalType) => {
    setPortalType(portal);
    localStorage.setItem('portalContext', portal);
  };

  return {
    portalType,
    isAdminPortal: portalType === 'admin',
    isClientPortal: portalType === 'client',
    switchToPortal,
    switchToAdmin: () => switchToPortal('admin'),
    switchToClient: () => switchToPortal('client')
  };
};
