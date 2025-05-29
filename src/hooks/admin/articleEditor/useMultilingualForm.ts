
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

type Language = 'en' | 'zh';

interface MultilingualContent {
  title: string;
  description: string;
  content: string;
  category: string;
  author_name: string;
}

interface MultilingualFormData {
  en: MultilingualContent;
  zh: MultilingualContent;
  image_url: string;
  published_at: string;
}

export const useMultilingualForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  
  const form = useForm<MultilingualFormData>({
    defaultValues: {
      en: {
        title: '',
        description: '',
        content: '',
        category: '',
        author_name: '',
      },
      zh: {
        title: '',
        description: '',
        content: '',
        category: '',
        author_name: '',
      },
      image_url: '',
      published_at: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const getCurrentLanguageData = () => {
    return form.getValues()[selectedLanguage];
  };

  const updateCurrentLanguageData = (data: Partial<MultilingualContent>) => {
    const currentValues = form.getValues();
    form.setValue(selectedLanguage, {
      ...currentValues[selectedLanguage],
      ...data
    });
  };

  // Enhanced content detection
  const hasContent = {
    en: Boolean(
      form.watch('en.title')?.trim() || 
      form.watch('en.content')?.trim() || 
      form.watch('en.description')?.trim()
    ),
    zh: Boolean(
      form.watch('zh.title')?.trim() || 
      form.watch('zh.content')?.trim() || 
      form.watch('zh.description')?.trim()
    )
  };

  // Language switching with forced field updates
  const handleLanguageChange = (newLanguage: Language) => {
    const currentData = form.getValues();
    console.log('Switching from', selectedLanguage, 'to', newLanguage);
    console.log('Current form data:', currentData);
    console.log('Target language data:', currentData[newLanguage]);
    
    setSelectedLanguage(newLanguage);
  };

  // Force form field updates when language changes
  useEffect(() => {
    const currentFormData = form.getValues();
    console.log('Language changed to:', selectedLanguage);
    console.log('Current language data:', currentFormData[selectedLanguage]);
    
    // Force all fields to update by triggering a re-render
    // This ensures form fields display the correct values for the selected language
    const languageData = currentFormData[selectedLanguage];
    
    // Explicitly set each field to force React Hook Form to update the UI
    Object.keys(languageData).forEach(key => {
      const fieldName = `${selectedLanguage}.${key}` as any;
      const value = languageData[key as keyof MultilingualContent];
      form.setValue(fieldName, value, { shouldValidate: false });
    });
    
    // Trigger form validation after a short delay to ensure all fields are updated
    setTimeout(() => {
      form.trigger();
    }, 10);
  }, [selectedLanguage, form]);

  return {
    form,
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    getCurrentLanguageData,
    updateCurrentLanguageData,
    hasContent
  };
};
