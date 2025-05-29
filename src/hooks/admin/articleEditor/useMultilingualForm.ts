
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

  // Enhanced language switching with form refresh
  const handleLanguageChange = (newLanguage: Language) => {
    const currentData = form.getValues();
    console.log('Switching from', selectedLanguage, 'to', newLanguage);
    console.log('Current form data:', currentData);
    console.log('Target language data:', currentData[newLanguage]);
    
    setSelectedLanguage(newLanguage);
  };

  // Force form to refresh when language changes
  useEffect(() => {
    const currentFormData = form.getValues();
    console.log('useEffect triggered for language change:', selectedLanguage);
    console.log('Current language data:', currentFormData[selectedLanguage]);
    
    // Force React Hook Form to refresh all field bindings
    // This ensures that the displayed values match the current language's data
    form.reset(currentFormData, { 
      keepDefaultValues: false,
      keepValues: true,
      keepDirty: true,
      keepTouched: true
    });
    
    // Also trigger revalidation to ensure all fields are properly bound
    setTimeout(() => {
      form.trigger();
    }, 0);
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
