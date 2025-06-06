
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
  const [refreshKey, setRefreshKey] = useState(0);
  
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

  // Handle language switching with proper form updates
  const handleLanguageChange = (newLanguage: Language) => {
    console.log('Language switching from', selectedLanguage, 'to', newLanguage);
    const currentFormData = form.getValues();
    console.log('Current form data before switch:', currentFormData);
    
    setSelectedLanguage(newLanguage);
    setRefreshKey(prev => prev + 1);
    
    // Force form to re-render and update field values
    setTimeout(() => {
      form.trigger();
      const newFormData = form.getValues();
      console.log('Form data after language switch:', newFormData);
      console.log('New language content:', newFormData[newLanguage]);
    }, 10);
  };

  // Force re-render when language changes to ensure form fields update
  useEffect(() => {
    console.log('Language changed to:', selectedLanguage);
    form.trigger();
  }, [selectedLanguage, form, refreshKey]);

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

  const hasContent = {
    en: Boolean(form.watch('en.title') || form.watch('en.content')),
    zh: Boolean(form.watch('zh.title') || form.watch('zh.content'))
  };

  // Get current language field values for proper display
  const getCurrentFieldValue = (fieldName: keyof MultilingualContent) => {
    const formValues = form.getValues();
    const languageData = formValues[selectedLanguage];
    const value = languageData?.[fieldName] || '';
    
    console.log(`Getting field value for ${selectedLanguage}.${fieldName}:`, {
      formValues,
      languageData,
      fieldName,
      value,
      refreshKey
    });
    
    return value;
  };

  return {
    form,
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    getCurrentLanguageData,
    updateCurrentLanguageData,
    getCurrentFieldValue,
    hasContent,
    refreshKey
  };
};
