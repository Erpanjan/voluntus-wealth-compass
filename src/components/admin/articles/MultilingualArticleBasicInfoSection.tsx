
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import {
  FormControl,
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

  return (
    <div className="space-y-8">
      <FormField
        key={`title-field-${selectedLanguage}`}
        control={form.control}
        name={`${selectedLanguage}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">Title *</FormLabel>
            <FormControl>
              <Input 
                key={`title-input-${selectedLanguage}`}
                placeholder="Title"
                {...field} 
                className="focus-visible:ring-gray-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        key={`description-field-${selectedLanguage}`}
        control={form.control}
        name={`${selectedLanguage}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">Description</FormLabel>
            <FormControl>
              <Textarea 
                key={`description-input-${selectedLanguage}`}
                placeholder="Description"
                rows={3}
                {...field} 
                className="focus-visible:ring-gray-400 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          key={`category-field-${selectedLanguage}`}
          control={form.control}
          name={`${selectedLanguage}.category`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-base">Category</FormLabel>
              <FormControl>
                <Input 
                  key={`category-input-${selectedLanguage}`}
                  placeholder="Category"
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          key={`author-field-${selectedLanguage}`}
          control={form.control}
          name={`${selectedLanguage}.author_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-base">Author</FormLabel>
              <FormControl>
                <Input 
                  key={`author-input-${selectedLanguage}`}
                  placeholder="Author"
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
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
            <FormLabel className="text-gray-700 text-base">Publish Date</FormLabel>
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MultilingualArticleBasicInfoSection;
