
// Helper functions for managing user-specific localStorage keys
export const getUserStorageKey = (userId: string, key: string): string => {
  return `user_${userId}_${key}`;
};

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
