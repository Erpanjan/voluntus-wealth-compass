
import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUserStorageKey } from './useLocalStorage';

export const useOnboardingStatus = (navigate: NavigateFunction) => {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Helper function to check onboarding data status and redirect accordingly
  const checkOnboardingStatus = async (userId: string) => {
    if (isCheckingStatus) return;
    
    try {
      setIsCheckingStatus(true);
      console.log('Checking onboarding status for user:', userId);
      
      // Ensure we're authenticated before proceeding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No valid session found during onboarding check');
        navigate('/login');
        return;
      }
      
      // First check database for onboarding data - prioritize this over localStorage
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('id, status, first_name, last_name, email, phone')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking onboarding data:', error);
        // If error, default to welcome page for safety
        navigate('/welcome');
        return;
      }
      
      console.log('Onboarding data found:', data);

      // Based on database onboarding data status
      if (data) {
        // Check if it's an empty draft (created by trigger but user never started onboarding)
        const isEmptyDraft = data.status === 'draft' && 
                            !data.first_name && 
                            !data.last_name && 
                            !data.email && 
                            !data.phone;
                            
        console.log('Is this an empty draft record?', isEmptyDraft);
        
        if (isEmptyDraft) {
          // It's a new user with an auto-created empty draft - send to welcome page
          localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
          localStorage.setItem('onboardingComplete', 'false');
          navigate('/welcome');
        } else if (data.status === 'draft') {
          // User has draft data but hasn't submitted it yet, go to onboarding
          localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
          localStorage.setItem('onboardingComplete', 'false');
          navigate('/onboarding');
        } else if (data.status === 'submitted') {
          // Application is submitted, go to pending approval
          localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'true');
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
          localStorage.setItem('onboardingComplete', 'false');
          navigate('/pending-approval');
        } else if (data.status === 'approved') {
          // Application is approved, go to dashboard
          localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'true');
          localStorage.setItem('onboardingComplete', 'true');
          navigate('/dashboard');
        }
      } else {
        // No onboarding data found, direct to welcome page
        console.log('No onboarding data found, directing to welcome page');
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        localStorage.setItem('onboardingComplete', 'false');
        navigate('/welcome');
      }
    } catch (err) {
      console.error('Unexpected error in checkOnboardingStatus:', err);
      navigate('/welcome');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return { checkOnboardingStatus, isCheckingStatus };
};
