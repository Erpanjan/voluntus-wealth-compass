
import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUserStorageKey } from './useLocalStorage';

export const useOnboardingStatus = (navigate: NavigateFunction) => {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Helper function to check onboarding data status and redirect accordingly
  // Optimized for performance
  const checkOnboardingStatus = async (userId: string) => {
    if (isCheckingStatus) return;
    
    try {
      setIsCheckingStatus(true);
      console.log('Checking onboarding status for user:', userId);
      
      // Check localStorage first for potential cache hit to avoid DB query
      const cachedStatus = localStorage.getItem(getUserStorageKey(userId, 'onboardingStatus'));
      const cachedTimestamp = localStorage.getItem(getUserStorageKey(userId, 'onboardingStatusTimestamp'));
      
      // Use cached status if it's less than 5 minutes old (timestamp is in milliseconds)
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
      const now = Date.now();
      
      if (cachedStatus && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < CACHE_TTL) {
        // Route based on cached status to avoid database query
        routeBasedOnStatus(cachedStatus, userId);
        return;
      }
      
      // Ensure we're authenticated before proceeding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No valid session found during onboarding check');
        navigate('/login');
        return;
      }
      
      // Query database for onboarding data with optimized select query
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('status, first_name, last_name, email, phone')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking onboarding data:', error);
        // If error, redirect to welcome page for safety
        navigate('/welcome');
        return;
      }
      
      console.log('Onboarding data found:', data);

      // If no data found, the application might have been deleted (rejected)
      // or this is a new user
      if (!data) {
        console.log('No onboarding data found - directing to welcome page');
        
        // Try to create an onboarding record for new users
        try {
          await supabase
            .from('onboarding_data')
            .insert({ id: userId, status: 'draft' });
        } catch (createError) {
          console.error('Error creating onboarding record:', createError);
        }
        
        // Set consistent localStorage state
        setLocalStorageState(userId, 'draft');
        navigate('/welcome');
        return;
      }

      // Cache status in localStorage
      localStorage.setItem(getUserStorageKey(userId, 'onboardingStatus'), data.status);
      localStorage.setItem(getUserStorageKey(userId, 'onboardingStatusTimestamp'), now.toString());
      
      // Route based on status
      routeBasedOnStatus(data.status, userId, data);
      
    } catch (err) {
      console.error('Unexpected error in checkOnboardingStatus:', err);
      navigate('/welcome');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Helper function to set localStorage consistently
  const setLocalStorageState = (userId: string, status: string) => {
    switch (status) {
      case 'draft':
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        localStorage.setItem('onboardingComplete', 'false');
        break;
      case 'submitted':
      case 'pending':
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'true');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        localStorage.setItem('onboardingComplete', 'false');
        break;
      case 'approved':
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'true');
        localStorage.setItem('onboardingComplete', 'true');
        break;
      default:
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        localStorage.setItem('onboardingComplete', 'false');
    }
  };
  
  // Helper function to route based on status
  const routeBasedOnStatus = (status: string, userId: string, data?: any) => {
    // Check if it's an empty draft (created by trigger but user never started onboarding)
    const isEmptyDraft = status === 'draft' && data && 
                        !data.first_name && 
                        !data.last_name && 
                        !data.email && 
                        !data.phone;
                        
    console.log('Is this an empty draft record?', isEmptyDraft);
    
    // Route based on status
    if (isEmptyDraft) {
      // It's a new user with an auto-created empty draft - send to welcome page
      setLocalStorageState(userId, 'draft');
      navigate('/welcome', { replace: true });
    } else if (status === 'draft') {
      // User has draft data but hasn't submitted it yet, go to onboarding
      setLocalStorageState(userId, 'draft');
      navigate('/onboarding', { replace: true });
    } else if (status === 'submitted' || status === 'pending') {
      // Application is submitted/pending, go to pending approval
      setLocalStorageState(userId, 'submitted');
      navigate('/pending-approval', { replace: true });
    } else if (status === 'approved') {
      // Application is approved, go to dashboard
      setLocalStorageState(userId, 'approved');
      navigate('/dashboard', { replace: true });
    } else {
      // Unknown status, default to welcome page
      console.log('Unknown application status:', status);
      setLocalStorageState(userId, 'draft');
      navigate('/welcome', { replace: true });
    }
  };

  return { checkOnboardingStatus, isCheckingStatus };
};
