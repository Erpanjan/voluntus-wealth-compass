
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuestionnaireStorage } from './hooks/useQuestionnaireStorage';
import { useGoalSelection } from './hooks/useGoalSelection';
import { QuestionnaireState, QuestionnaireProviderProps } from './types/questionnaireTypes';

const QuestionnaireContext = createContext<QuestionnaireState | null>(null);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({ 
  children, 
  currentStep, 
  setCurrentStep 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { loadSavedAnswers, saveProgress, isSaving } = useQuestionnaireStorage();
  
  // State for storing all questionnaire answers
  const [answers, setAnswers] = useState<Record<string, any>>({
    goals: [], // Will store selected financial goals
    goalDetails: {} // Will store per-goal details
  });

  const [dataLoadAttempted, setDataLoadAttempted] = useState(false);
  const { currentGoalIndex, setCurrentGoalIndex, getSelectedGoals, currentGoal } = useGoalSelection(answers);

  // Load saved answers from Supabase and localStorage on initial render
  useEffect(() => {
    if (dataLoadAttempted) return; // Prevent duplicate loading attempts
    
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const initializeData = async () => {
      if (isMounted) {
        setIsLoading(true);
        console.log('Loading questionnaire data...');
      }
      
      try {
        const loadedAnswers = await loadSavedAnswers();
        
        // Set the answers state if we found data
        if (loadedAnswers && isMounted) {
          console.log('Setting loaded answers to state');
          setAnswers(loadedAnswers);
        } else {
          console.log('No existing questionnaire data found, using default empty state');
        }
      } catch (error) {
        console.error('Error initializing questionnaire data:', error);
        if (isMounted) {
          toast({
            title: "Data Loading Notice",
            description: "Starting with a fresh questionnaire. Your progress will be saved as you go.",
            variant: "default"
          });
        }
      } finally {
        // Always set loading to false to prevent UI freeze
        if (isMounted) {
          setIsLoading(false);
          setDataLoadAttempted(true);
          console.log('Questionnaire data loading complete');
        }
      }
    };
    
    initializeData();
    
    // Set a timeout to prevent infinite loading - reduced to 2 seconds
    const timeoutId = setTimeout(() => {
      if (isLoading && isMounted) {
        setIsLoading(false);
        setDataLoadAttempted(true);
        console.warn('Loading timeout reached, proceeding with empty questionnaire');
      }
    }, 2000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [toast, dataLoadAttempted, loadSavedAnswers, isLoading]);

  // Autosave functionality - debounced to avoid too many saves
  useEffect(() => {
    // Skip the initial load
    if (isLoading || !dataLoadAttempted) return;
    
    // Don't save empty answers object
    if (Object.keys(answers).length <= 2 && 
        answers.goals?.length === 0 && 
        Object.keys(answers.goalDetails || {}).length === 0) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      // Just save to localStorage for the autosave feature
      try {
        localStorage.setItem('questionnaireAnswers', JSON.stringify(answers));
        console.log('Autosaved questionnaire data to localStorage');
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [answers, isLoading, dataLoadAttempted]);

  // Handle answer updates
  const updateAnswer = (questionId: string, value: any) => {
    console.log(`Updating ${questionId} with:`, value);
    setAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [questionId]: value
      };
      return updatedAnswers;
    });
  };

  // Function to progress to the next goal or step
  const handleGoalQuestionComplete = () => {
    if (currentGoalIndex < getSelectedGoals().length - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    } else {
      // Move to the next main step after all goals are processed
      setCurrentStep(currentStep + 1);
      setCurrentGoalIndex(0); // Reset for potential back navigation
      
      // Save progress when moving to the next major section
      saveProgress(answers, currentStep, false).catch(err => {
        console.error('Error saving progress:', err);
      });
    }
  };

  // Wrap saveProgress to include the current state and step
  const handleSaveProgress = async (): Promise<boolean> => {
    // Determine completion status
    const isCompleted = currentStep >= 14;
    return saveProgress(answers, currentStep, isCompleted);
  };

  const value = {
    answers,
    currentGoalIndex,
    updateAnswer,
    getSelectedGoals,
    currentGoal,
    handleGoalQuestionComplete,
    isLoading,
    saveProgress: handleSaveProgress,
    isSaving
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </QuestionnaireContext.Provider>
  );
};
