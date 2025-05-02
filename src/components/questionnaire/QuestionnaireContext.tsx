
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoalType {
  id: string;
  name: string;
  interestLevel: string;
  isCustom?: boolean;
}

interface GoalDetail {
  timeline?: string;
  riskAppetite?: string;
  riskTolerance?: string;
  marketResponse?: string;
}

interface QuestionnaireState {
  answers: Record<string, any>;
  currentGoalIndex: number;
  updateAnswer: (questionId: string, value: any) => void;
  getSelectedGoals: () => GoalType[];
  currentGoal: GoalType | null;
  handleGoalQuestionComplete: () => void;
  isLoading: boolean;
  saveProgress: () => Promise<boolean>;
  isSaving: boolean;
}

// Define an interface for the questionnaire data from the database
interface QuestionnaireResponseData {
  id: string;
  user_id: string;
  completed?: boolean;
  investment_goals?: string;
  risk_tolerance?: string;
  time_horizon?: string;
  additional_info?: string;
  age_group?: string;
  income_level?: string;
  net_worth?: string;
  investment_knowledge?: string;
  investment_experience?: string;
  complex_products?: number;
  investment_composition?: string;
  behavioral_biases?: string;
  answers_json?: string;
  created_at: string;
  updated_at: string;
}

const QuestionnaireContext = createContext<QuestionnaireState | null>(null);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

interface QuestionnaireProviderProps {
  children: ReactNode | ((contextValue: QuestionnaireState) => ReactNode);
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({ 
  children, 
  currentStep, 
  setCurrentStep 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for storing all questionnaire answers
  const [answers, setAnswers] = useState<Record<string, any>>({
    goals: [], // Will store selected financial goals
    goalDetails: {} // Will store per-goal details
  });

  // State to track which goal we're currently asking about for questions 11-14
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [dataLoadAttempted, setDataLoadAttempted] = useState(false);

  // Load saved answers from Supabase and localStorage on initial render
  useEffect(() => {
    if (dataLoadAttempted) return; // Prevent duplicate loading attempts
    
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const loadSavedAnswers = async () => {
      if (isMounted) {
        setIsLoading(true);
        console.log('Loading questionnaire data...');
      }
      
      try {
        // Try loading from localStorage first for quick rendering
        const localData = localStorage.getItem('questionnaireAnswers');
        let loadedAnswers = localData ? JSON.parse(localData) : null;
        
        // Log if we found localStorage data
        if (loadedAnswers) {
          console.log('Found questionnaire data in localStorage');
        }
        
        // Then try to get from Supabase if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          console.log('User is authenticated, checking for questionnaire data in database');
          const { data, error } = await supabase
            .from('questionnaire_responses')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle(); // Using maybeSingle to avoid errors
            
          if (error) {
            console.error('Error fetching questionnaire data from database:', error);
            // Continue with localStorage data if available
          } else if (data) {
            console.log('Found questionnaire data in database');
            // Cast data to our interface for type safety
            const responseData = data as QuestionnaireResponseData;
            
            // If we have database data, convert and use it
            const dbAnswers = {
              ...loadedAnswers, // Keep any local data not stored in DB schema
              ageGroup: responseData.age_group,
              income: responseData.income_level,
              netWorth: responseData.net_worth,
              investmentKnowledge: responseData.investment_knowledge,
              investmentExperience: responseData.investment_experience,
              complexProducts: responseData.complex_products,
              investmentComposition: responseData.investment_composition,
              behavioralBiases: responseData.behavioral_biases,
              // For complete answers JSON data
              ...(responseData.answers_json ? JSON.parse(responseData.answers_json as string) : {})
            };
            
            loadedAnswers = dbAnswers;
            
            // Update local storage with the latest from DB
            localStorage.setItem('questionnaireAnswers', JSON.stringify(dbAnswers));
          } else {
            console.log('No questionnaire data found in database');
          }
        } else {
          console.log('User is not authenticated, using only localStorage data');
        }
        
        // Set the answers state if we found data
        if (loadedAnswers && isMounted) {
          console.log('Setting loaded answers to state');
          setAnswers(loadedAnswers);
        } else {
          console.log('No existing questionnaire data found, using default empty state');
        }
      } catch (error) {
        console.error('Error loading saved answers:', error);
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
    
    loadSavedAnswers();
    
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
  }, [toast, dataLoadAttempted]);

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
      saveToLocalStorage(answers);
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [answers, isLoading, dataLoadAttempted]);

  // Function to save to localStorage
  const saveToLocalStorage = (data: Record<string, any>) => {
    try {
      localStorage.setItem('questionnaireAnswers', JSON.stringify(data));
      console.log('Saved questionnaire data to localStorage');
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

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

  // Save progress to Supabase and update onboarding data
  const saveProgress = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // If not logged in, just save to localStorage
        saveToLocalStorage(answers);
        toast({
          title: "Progress Saved Locally",
          description: "Your answers are saved on this device. Log in to save them to your account.",
        });
        return true;
      }
      
      // Save to localStorage first to ensure data is not lost
      saveToLocalStorage(answers);
      
      // Format the data for the questionnaire_responses table
      const dataToSave = {
        user_id: session.user.id,
        completed: currentStep >= 14, // Consider it completed if they reached the final steps
        age_group: answers.ageGroup || null,
        income_level: answers.income || null,
        net_worth: answers.netWorth || null,
        investment_knowledge: answers.investmentKnowledge || null,
        investment_experience: answers.investmentExperience || null,
        complex_products: answers.complexProducts || null,
        investment_composition: answers.investmentComposition || null,
        behavioral_biases: answers.behavioralBiases || null,
        answers_json: JSON.stringify(answers), // Store complete answers as JSON
        updated_at: new Date().toISOString()
      };
      
      console.log('Saving questionnaire data to database:', dataToSave);
      
      // Save to Supabase
      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert(dataToSave, { onConflict: 'user_id' });
        
      if (error) {
        console.error('Error saving to database:', error);
        throw error;
      }
      
      console.log('Successfully saved questionnaire data to database');
      
      // Also update the onboarding data to mark questionnaire as completed
      const onboardingUpdate = {
        updated_at: new Date().toISOString()
      };
      
      // Fetch current onboarding data first
      const { data: onboardingData } = await supabase
        .from('onboarding_data')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle(); 
        
      if (onboardingData) {
        await supabase
          .from('onboarding_data')
          .update(onboardingUpdate)
          .eq('id', session.user.id);
        
        console.log('Updated onboarding data timestamp');
      }
      
      toast({
        title: "Progress Saved",
        description: "Your answers have been saved to your account.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving questionnaire progress:', error);
      toast({
        title: "Error Saving Data",
        description: "Could not save your answers. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Function to get selected goals (used for goal-specific questions)
  const getSelectedGoals = () => {
    console.log("All goals:", answers.goals);
    const filteredGoals = answers.goals?.filter(goal => {
      const interestLevel = goal.interestLevel?.toLowerCase();
      console.log(`Goal: ${goal.name}, Interest Level: ${interestLevel}`);
      return (
        interestLevel === 'already-planned' || 
        interestLevel === 'strongly-interested' || 
        interestLevel === 'would-consider'
      );
    }) || [];
    
    console.log("Filtered goals:", filteredGoals);
    return filteredGoals;
  };
  
  // Get the current goal for goal-specific questions
  const selectedGoals = getSelectedGoals();
  const currentGoal = selectedGoals[currentGoalIndex] || null;

  // Function to progress to the next goal or step
  const handleGoalQuestionComplete = () => {
    if (currentGoalIndex < selectedGoals.length - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    } else {
      // Move to the next main step after all goals are processed
      setCurrentStep(currentStep + 1);
      setCurrentGoalIndex(0); // Reset for potential back navigation
      
      // Save progress when moving to the next major section
      saveProgress().catch(err => {
        console.error('Error saving progress:', err);
      });
    }
  };

  const value = {
    answers,
    currentGoalIndex,
    updateAnswer,
    getSelectedGoals,
    currentGoal,
    handleGoalQuestionComplete,
    isLoading,
    saveProgress,
    isSaving
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </QuestionnaireContext.Provider>
  );
};
