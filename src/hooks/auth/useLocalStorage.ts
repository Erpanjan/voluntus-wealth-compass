
// Helper functions for managing user-specific localStorage keys
export const getUserStorageKey = (userId: string, key: string): string => {
  return `user_${userId}_${key}`;
};

export const clearUserStateFlags = (userId?: string): void => {
  // Clear global flags
  localStorage.removeItem('onboardingComplete');
  localStorage.removeItem('applicationSubmitted');
  localStorage.removeItem('isAdminMode');
  localStorage.removeItem('isAuthenticated');
  
  // Clear any draft data
  localStorage.removeItem('onboardingDraft');
  
  // If we have a userId, clear user-specific flags too
  if (userId) {
    localStorage.removeItem(getUserStorageKey(userId, 'onboardingComplete'));
    localStorage.removeItem(getUserStorageKey(userId, 'applicationSubmitted'));
    localStorage.removeItem(getUserStorageKey(userId, 'onboardingDraft'));
  }
  
  console.log('Cleared all user state flags from localStorage', userId ? `for user ${userId}` : '');
};
