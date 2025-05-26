
import { useState, useEffect, useCallback } from 'react';

interface ConnectionInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number;
  rtt: number;
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  const checkConnectionSpeed = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection as ConnectionInfo;
      
      if (connection) {
        const isSlowByType = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        const isSlowBySpeed = connection.downlink < 1.5; // Less than 1.5 Mbps
        const isSlowByLatency = connection.rtt > 300; // More than 300ms RTT
        
        const isSlow = isSlowByType || isSlowBySpeed || isSlowByLatency;
        
        setIsSlowConnection(isSlow);
        setConnectionType(connection.effectiveType);
        
        console.log('Connection check:', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          isSlowConnection: isSlow
        });
      }
    } else {
      // Fallback: assume good connection if no API available
      setIsSlowConnection(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check connection quality when coming back online
      setTimeout(checkConnectionSpeed, 100);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsSlowConnection(false);
    };

    window.addEventListener('online', handleOnline, { passive: true });
    window.addEventListener('offline', handleOffline, { passive: true });

    // Initial connection check
    checkConnectionSpeed();

    // Check connection quality periodically
    const connectionInterval = setInterval(checkConnectionSpeed, 30000); // Every 30 seconds

    // Monitor connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', checkConnectionSpeed);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          connection.removeEventListener('change', checkConnectionSpeed);
          clearInterval(connectionInterval);
        };
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionInterval);
    };
  }, [checkConnectionSpeed]);

  return { 
    isOnline, 
    isSlowConnection, 
    connectionType,
    refresh: checkConnectionSpeed
  };
}
