
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
  refreshKey?: number;
}

const MultilingualArticleBasicInfoSection: React.FC<MultilingualArticleBasicInfoSectionProps> = ({
  form,
  selectedLanguage,
  refreshKey = 0
}) => {
  return (
    <div className="space-y-8" key={`basic-info-${selectedLanguage}-${refreshKey}`}>
      <FormField
        control={form.control}
        name={`${selectedLanguage}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">
              Title *
            </FormLabel>
            <FormControl>
              <Input 
                key={`${selectedLanguage}-title-${refreshKey}`}
                placeholder="Enter article title" 
                value={field.value || ''}
                onChange={field.onChange}
                className="focus-visible:ring-gray-400"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              The main title of your article (required)
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
              Description
            </FormLabel>
            <FormControl>
              <Textarea 
                key={`${selectedLanguage}-description-${refreshKey}`}
                placeholder="Enter article description (optional)" 
                rows={3}
                value={field.value || ''}
                onChange={field.onChange}
                className="focus-visible:ring-gray-400 resize-none"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              A brief summary of your article (optional)
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
                Category
              </FormLabel>
              <FormControl>
                <Input 
                  key={`${selectedLanguage}-category-${refreshKey}`}
                  placeholder="Enter category (optional)" 
                  value={field.value || ''}
                  onChange={field.onChange}
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Category of your article (optional)
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
                Author
              </FormLabel>
              <FormControl>
                <Input 
                  key={`${selectedLanguage}-author-${refreshKey}`}
                  placeholder="Enter author name (optional)" 
                  value={field.value || ''}
                  onChange={field.onChange}
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Name of the article author (optional)
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
              When the article should be published
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MultilingualArticleBasicInfoSection;
