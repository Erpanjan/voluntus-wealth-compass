
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

  const hasContent = {
    en: Boolean(form.watch('en.title') || form.watch('en.content')),
    zh: Boolean(form.watch('zh.title') || form.watch('zh.content'))
  };

  return {
    form,
    selectedLanguage,
    setSelectedLanguage,
    getCurrentLanguageData,
    updateCurrentLanguageData,
    hasContent
  };
};
