
import { useState } from 'react';
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

  // Enhanced language switching with debugging
  const handleLanguageChange = (newLanguage: Language) => {
    const currentData = form.getValues();
    console.log('Switching from', selectedLanguage, 'to', newLanguage);
    console.log('Current form data:', currentData);
    console.log('Target language data:', currentData[newLanguage]);
    
    setSelectedLanguage(newLanguage);
    
    // Force form to acknowledge the language change
    setTimeout(() => {
      const updatedData = form.getValues();
      console.log('After language switch, form data:', updatedData[newLanguage]);
    }, 100);
  };

  return {
    form,
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    getCurrentLanguageData,
    updateCurrentLanguageData,
    hasContent
  };
};
