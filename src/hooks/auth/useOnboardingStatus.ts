
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
          const { error: insertError } = await supabase
            .from('onboarding_data')
            .insert({ id: userId, status: 'draft' });
            
          if (insertError) {
            console.error('Failed to create onboarding record:', insertError);
          }
        } catch (createError) {
          console.error('Error creating onboarding record:', createError);
        }
        
        // Set consistent localStorage state
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'false');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        localStorage.setItem('onboardingComplete', 'false');
        navigate('/welcome');
        return;
      }

      // Based on database onboarding data status
      // Check if it's an empty draft (created by trigger but user never started onboarding)
      const isEmptyDraft = data.status === 'draft' && 
                          !data.first_name && 
                          !data.last_name && 
                          !data.email && 
                          !data.phone;
                          
      console.log('Is this an empty draft record?', isEmptyDraft);
      
      // Set consistent localStorage state based on status
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
      } else if (data.status === 'submitted' || data.status === 'pending') {
        // Application is submitted/pending, go to pending approval
        localStorage.setItem(getUserStorageKey(userId, 'applicationSubmitted'), 'true');
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'false');
        localStorage.setItem('onboardingComplete', 'false');
        navigate('/pending-approval');
      } else if (data.status === 'approved') {
        // Application is approved, go to dashboard
        localStorage.setItem(getUserStorageKey(userId, 'onboardingComplete'), 'true');
        localStorage.setItem('onboardingComplete', 'true');
        navigate('/dashboard');
      } else {
        // Unknown status, default to welcome page
        console.log('Unknown application status:', data.status);
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
