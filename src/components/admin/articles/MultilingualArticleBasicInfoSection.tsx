
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

type Language = 'en' | 'zh';

interface MultilingualArticleBasicInfoSectionProps {
  form: UseFormReturn<any>;
  selectedLanguage: Language;
}

const MultilingualArticleBasicInfoSection: React.FC<MultilingualArticleBasicInfoSectionProps> = ({
  form,
  selectedLanguage
}) => {
  // Debug logging for language switching
  React.useEffect(() => {
    const currentData = form.getValues(selectedLanguage);
    console.log(`Basic info language switched to ${selectedLanguage}:`, currentData);
  }, [selectedLanguage, form]);

  const languageLabel = selectedLanguage === 'en' ? 'English' : 'Chinese';

  return (
    <div className="space-y-8">
      <div className="text-sm text-gray-600 mb-4">
        Currently editing: <span className="font-medium">{languageLabel}</span> version
      </div>
      
      <FormField
        control={form.control}
        name={`${selectedLanguage}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">
              Title * ({languageLabel})
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={`Enter article title in ${languageLabel}`}
                {...field} 
                className="focus-visible:ring-gray-400"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              The main title of your article in {languageLabel} (required)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name={`${selectedLanguage}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">
              Description ({languageLabel})
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder={`Enter article description in ${languageLabel} (optional)`}
                rows={3}
                {...field} 
                className="focus-visible:ring-gray-400 resize-none"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              A brief summary of your article in {languageLabel} (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name={`${selectedLanguage}.category`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-base">
                Category ({languageLabel})
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Enter category in ${languageLabel} (optional)`}
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Category of your article in {languageLabel} (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${selectedLanguage}.author_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-base">
                Author ({languageLabel})
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Enter author name in ${languageLabel} (optional)`}
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Name of the article author in {languageLabel} (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="published_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">
              Publish Date
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="date"
                  className="pl-10 focus-visible:ring-gray-400"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription className="text-gray-500">
              When the article should be published (applies to both languages)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MultilingualArticleBasicInfoSection;
