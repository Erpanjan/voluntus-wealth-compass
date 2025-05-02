
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';

export type PortalType = 'admin' | 'client';

interface PortalContextProps {
  portalType: PortalType;
  isAdminPortal: boolean;
  isClientPortal: boolean;
  switchToPortal: (portal: PortalType) => void;
  switchToAdmin: () => void;
  switchToClient: () => void;
  enforcePortalBoundary: (targetPortal: PortalType) => boolean;
}

// Create a context for portal state
const PortalContext = createContext<PortalContextProps | undefined>(undefined);

// Provider component for the portal context
export const PortalContextProvider: React.FC<{ children: ReactNode; initialPortal?: PortalType }> = ({ 
  children, 
  initialPortal = 'client' 
}) => {
  // Get initial portal type from localStorage or use the provided default
  const [portalType, setPortalType] = useState<PortalType>(() => {
    const storedPortal = localStorage.getItem('portalContext');
    if (storedPortal === 'admin' || storedPortal === 'client') {
      return storedPortal;
    }
    return initialPortal;
  });

  // Save portal type to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portalContext', portalType);
    // Also update isAdminMode for backward compatibility
    if (portalType === 'admin') {
      localStorage.setItem('isAdminMode', 'true');
    } else {
      localStorage.removeItem('isAdminMode');
    }
  }, [portalType]);

  // Function to switch between portals
  const switchToPortal = (portal: PortalType) => {
    console.log(`Switching to ${portal} portal`);
    setPortalType(portal);
    localStorage.setItem('portalContext', portal);
  };

  // Helper function to enforce portal boundaries (prevents unwanted redirects)
  const enforcePortalBoundary = (targetPortal: PortalType): boolean => {
    // If already in the target portal, no need to enforce
    if (portalType === targetPortal) return true;
    
    // Check if user is authenticated in the target portal
    const isAuthenticatedInPortal = localStorage.getItem('isAuthenticated') === 'true';
    const isAdminUser = localStorage.getItem('isAdminMode') === 'true';
    
    // Logic for enforcing portal boundaries
    if (targetPortal === 'admin' && !isAdminUser) {
      console.log('Enforcing boundary: Non-admin user tried to access admin portal');
      return false;
    }
    
    // Allow admin users to access client portal without restrictions
    // but set the context correctly
    if (targetPortal === 'client' && isAdminUser) {
      console.log('Admin user accessing client portal');
      return true;
    }
    
    return isAuthenticatedInPortal;
  };

  const value = {
    portalType,
    isAdminPortal: portalType === 'admin',
    isClientPortal: portalType === 'client',
    switchToPortal,
    switchToAdmin: () => switchToPortal('admin'),
    switchToClient: () => switchToPortal('client'),
    enforcePortalBoundary
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
};

// Custom hook for using the portal context
export const usePortalContext = (initialPortal?: PortalType) => {
  const context = useContext(PortalContext);
  
  // If hook is used outside of provider, create a local state
  // This provides backward compatibility
  if (context === undefined) {
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
      // Also update isAdminMode for backward compatibility
      if (portalType === 'admin') {
        localStorage.setItem('isAdminMode', 'true');
      } else {
        localStorage.removeItem('isAdminMode');
      }
    }, [portalType]);

    // Function to switch between portals
    const switchToPortal = (portal: PortalType) => {
      console.log(`Switching to ${portal} portal (local state)`);
      setPortalType(portal);
      localStorage.setItem('portalContext', portal);
    };

    const enforcePortalBoundary = (targetPortal: PortalType): boolean => {
      if (portalType === targetPortal) return true;
      
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const isAdminUser = localStorage.getItem('isAdminMode') === 'true';
      
      if (targetPortal === 'admin' && !isAdminUser) return false;
      return isAuthenticated;
    };

    return {
      portalType,
      isAdminPortal: portalType === 'admin',
      isClientPortal: portalType === 'client',
      switchToPortal,
      switchToAdmin: () => switchToPortal('admin'),
      switchToClient: () => switchToPortal('client'),
      enforcePortalBoundary
    };
  }
  
  return context;
};

export default usePortalContext;
