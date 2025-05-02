
import type { PortalType } from './usePortalContext';

// Helper functions for managing user-specific localStorage keys
export const getUserStorageKey = (userId: string, key: string): string => {
  return `user_${userId}_${key}`;
};

// Get portal-specific storage key
export const getPortalStorageKey = (portal: PortalType, key: string): string => {
  return `${portal}_${key}`;
};

// Clear all user state flags
export const clearUserStateFlags = (userId?: string): void => {
  console.log('Clearing all user state flags from localStorage', userId ? `for user ${userId}` : '');
  
  // Clear global flags
  localStorage.removeItem('onboardingComplete');
  localStorage.removeItem('applicationSubmitted');
  localStorage.removeItem('isAdminMode');
  localStorage.removeItem('isAuthenticated');
  
  // Clear questionnaire data
  localStorage.removeItem('questionnaireAnswers');
  
  // Clear onboarding data
  localStorage.removeItem('onboardingDraft');
  
  // If we have a userId, clear user-specific flags too
  if (userId) {
    localStorage.removeItem(getUserStorageKey(userId, 'onboardingComplete'));
    localStorage.removeItem(getUserStorageKey(userId, 'applicationSubmitted'));
    localStorage.removeItem(getUserStorageKey(userId, 'lastLoginTime'));
  }
  
  // Additional safeguards: scan localStorage for any keys containing 'user_'
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('user_') || key.includes('supabase'))) {
      localStorage.removeItem(key);
    }
  }
};

// Clear only portal-specific flags
export const clearPortalSpecificFlags = (portal: PortalType): void => {
  console.log(`Clearing ${portal} portal-specific flags from localStorage`);
  
  const keysToRemove: string[] = [];
  
  // Scan localStorage for portal-specific keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${portal}_`)) {
      keysToRemove.push(key);
    }
  }
  
  // Portal-specific flags
  if (portal === 'admin') {
    localStorage.removeItem('isAdminMode');
  } else if (portal === 'client') {
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('applicationSubmitted');
    localStorage.removeItem('questionnaireAnswers');
    localStorage.removeItem('onboardingDraft');
  }
  
  // Remove collected keys
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Set a portal-specific flag
export const setPortalFlag = (portal: PortalType, key: string, value: string): void => {
  localStorage.setItem(getPortalStorageKey(portal, key), value);
};

// Get a portal-specific flag
export const getPortalFlag = (portal: PortalType, key: string): string | null => {
  return localStorage.getItem(getPortalStorageKey(portal, key));
};
