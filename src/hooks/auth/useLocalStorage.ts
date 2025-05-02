
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
  
  // Clear all Supabase session-related items from localStorage
  clearSupabaseSession();
  
  console.log('Cleared all user state flags from localStorage', userId ? `for user ${userId}` : '');
};

/**
 * Finds and clears all Supabase-related auth tokens from localStorage
 * Supabase stores session data with keys that start with 'sb-'
 * and end with '-auth-token' or similar patterns
 */
export const clearSupabaseSession = (): void => {
  // Get all keys in localStorage
  const localStorageKeys = Object.keys(localStorage);
  
  // Find and remove Supabase auth-related items
  const supabaseKeys = localStorageKeys.filter(key => 
    key.startsWith('sb-') && (
      key.endsWith('-auth-token') || 
      key.includes('-auth-') || 
      key.includes('supabase')
    )
  );
  
  // Remove each key
  supabaseKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removed Supabase session key: ${key}`);
  });
  
  console.log(`Cleared ${supabaseKeys.length} Supabase session items from localStorage`);
};
