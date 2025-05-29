
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Language = 'en' | 'zh';

interface MultilingualArticleBasicInfoSectionProps {
  form: UseFormReturn<any>;
  selectedLanguage: Language;
  getCurrentFieldValue: (fieldName: string) => string;
}

const MultilingualArticleBasicInfoSection: React.FC<MultilingualArticleBasicInfoSectionProps> = ({ 
  form, 
  selectedLanguage,
  getCurrentFieldValue,
}) => {
  const isEnglish = selectedLanguage === 'en';
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name={`${selectedLanguage}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                {isEnglish ? 'Article Title' : '文章标题'}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder={isEnglish ? 'Enter article title...' : '输入文章标题...'}
                  className="border-gray-300 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${selectedLanguage}.category`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                {isEnglish ? 'Category' : '分类'}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder={isEnglish ? 'Enter category...' : '输入分类...'}
                  className="border-gray-300 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`${selectedLanguage}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">
              {isEnglish ? 'Description' : '描述'}
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                placeholder={isEnglish ? 'Enter article description...' : '输入文章描述...'}
                className="border-gray-300 focus:border-blue-500 min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name={`${selectedLanguage}.author_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                {isEnglish ? 'Author Name' : '作者姓名'}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder={isEnglish ? 'Enter author name...' : '输入作者姓名...'}
                  className="border-gray-300 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                {isEnglish ? 'Publication Date' : '发布日期'}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="date"
                  className="border-gray-300 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default MultilingualArticleBasicInfoSection;
