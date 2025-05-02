
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QuestionnaireResponseData } from '../types/questionnaireTypes';

export const useQuestionnaireStorage = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Function to save to localStorage
  const saveToLocalStorage = (data: Record<string, any>) => {
    try {
      localStorage.setItem('questionnaireAnswers', JSON.stringify(data));
      console.log('Saved questionnaire data to localStorage');
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  // Load questionnaire data from localStorage and Supabase
  const loadSavedAnswers = async (): Promise<Record<string, any> | null> => {
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
      
      return loadedAnswers;
    } catch (error) {
      console.error('Error loading saved answers:', error);
      return null;
    }
  };

  // Save progress to Supabase and update onboarding data
  const saveProgress = async (
    answers: Record<string, any>, 
    currentStep: number, 
    isCompleted: boolean = false
  ): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // If not logged in, just save to localStorage
        saveToLocalStorage(answers);
        toast({
          title: "Progress Saved Locally",
          description: "Your answers are saved on this device. Log in to save them to your account.",
        });
        return false; // Return false since we couldn't save to Supabase
      }
      
      // Save to localStorage first to ensure data is not lost
      saveToLocalStorage(answers);
      
      console.log('Saving questionnaire data to database');
      
      // Format the data for the questionnaire_responses table
      const dataToSave = {
        user_id: session.user.id,
        completed: isCompleted,
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
      
      // Save to Supabase with detailed error logging
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .upsert(dataToSave, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select(); // Add select to get the response data
        
      if (error) {
        console.error('Error saving to database:', error);
        setSaveError(`Database error: ${error.message}`);
        throw error;
      }
      
      console.log('Successfully saved questionnaire data to database:', data);
      
      // Also update the onboarding data to mark questionnaire as completed
      if (isCompleted) {
        try {
          const onboardingUpdate = {
            updated_at: new Date().toISOString()
          };
          
          // Fetch current onboarding data first
          const { data: onboardingData, error: fetchError } = await supabase
            .from('onboarding_data')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle(); 
            
          if (fetchError) {
            console.error('Error fetching onboarding data:', fetchError);
          }
            
          if (onboardingData) {
            const { error: updateError } = await supabase
              .from('onboarding_data')
              .update({
                ...onboardingUpdate,
                // Update the data to indicate questionnaire is completed
              })
              .eq('id', session.user.id);
            
            if (updateError) {
              console.error('Error updating onboarding data:', updateError);
            } else {
              console.log('Updated onboarding data timestamp');
            }
          } else {
            console.log('No onboarding data found for user');
          }
        } catch (onboardingError) {
          console.error('Error updating onboarding data:', onboardingError);
          // Don't throw here, as the main questionnaire data was saved successfully
        }
      }
      
      toast({
        title: "Progress Saved",
        description: "Your answers have been saved to your account.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving questionnaire progress:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error saving data');
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

  return {
    saveToLocalStorage,
    loadSavedAnswers,
    saveProgress,
    isSaving,
    saveError
  };
};
