
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useQuestionnaireData = (currentStep: number) => {
  const { toast } = useToast();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoadAttempted, setDataLoadAttempted] = useState(false);

  // Calculate the completion percentage based on current step and answers
  const calculateCompletion = () => {
    // Get the questionnaire answers from local storage
    try {
      const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
      if (savedQuestionnaire) {
        const savedData = JSON.parse(savedQuestionnaire);
        
        // Count how many questions have been answered
        let count = 0;
        
        // Basic questions count
        const basicKeys = [
          'ageGroup', 'income', 'netWorth', 'investmentKnowledge',
          'investmentExperience', 'complexProducts', 'investmentComposition',
          'behavioralBiases'
        ];
        
        count += basicKeys.filter(key => 
          savedData[key] !== undefined && 
          savedData[key] !== null && 
          savedData[key] !== ''
        ).length;
        
        // Handle goals section
        if (savedData.goals && Array.isArray(savedData.goals) && savedData.goals.length > 0) {
          count += 1;
          
          // Check goal priorities
          if (savedData.goalPriorities && savedData.goalPriorities.length > 0) {
            count += 1;
          }
          
          // Goal details count
          if (savedData.goalDetails && typeof savedData.goalDetails === 'object') {
            count += Math.min(3, Object.keys(savedData.goalDetails).length);
          }
        }
        
        setAnsweredQuestions(count);
        return count;
      }
    } catch (e) {
      console.error('Error calculating completion:', e);
    }
    
    // Default to current step as fallback
    return Math.max(1, currentStep);
  };

  // Check authentication status and load previous step
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        // Try to load the last saved step from localStorage first for fast initial display
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        if (savedQuestionnaire && isMounted) {
          try {
            calculateCompletion();
          } catch (e) {
            console.error('Error parsing saved questionnaire data:', e);
          }
        }

        // Then check auth status with a timeout to not block UI
        try {
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 1000)
          );
          
          const { data: { session } } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as { data: { session: any } };
          
          // If no session, show message but don't redirect immediately
          if (!session && isMounted) {
            console.log('No active session found');
            setError('Please log in to save your questionnaire progress');
          }
        } catch (error) {
          console.log('Session check timed out, continuing with questionnaire');
        }
      } catch (error) {
        console.error('Error initializing questionnaire:', error);
      } finally {
        if (isMounted) {
          setLoadingInitial(false);
          // Short delay before setting ready to avoid UI flickering
          setTimeout(() => {
            if (isMounted) setIsReady(true);
          }, 100);
        }
      }
    };
    
    init();
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loadingInitial && isMounted) {
        setLoadingInitial(false);
        setIsReady(true);
        console.log('Loading took too long, proceeding with fresh questionnaire');
      }
    }, 1000); // Reduced from 3 seconds to 1 second
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [toast]);

  // Update answered questions count when step changes
  useEffect(() => {
    calculateCompletion();
  }, [currentStep]);

  // Calculate completion percentage for progress indicator
  const totalSteps = 15;
  const progressPercentage = Math.min(100, Math.round((answeredQuestions / totalSteps) * 100));

  return {
    loadingInitial,
    error,
    isReady,
    progressPercentage,
    totalSteps,
    setIsReady
  };
};
