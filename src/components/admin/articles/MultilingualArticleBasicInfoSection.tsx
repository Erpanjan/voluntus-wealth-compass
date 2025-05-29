
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
  const isEnglish = selectedLanguage === 'en';
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-sm font-medium">
            {isEnglish ? '🇺🇸 English' : '🇨🇳 中文'}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {isEnglish ? 'Editing English version' : 'Editing Chinese version'}
        </span>
      </div>

      <FormField
        control={form.control}
        name={`${selectedLanguage}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">
              {isEnglish ? 'Title *' : '标题 *'}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={isEnglish ? "Enter article title" : "输入文章标题"} 
                {...field} 
                className="focus-visible:ring-gray-400"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              {isEnglish 
                ? 'The main title of your article (required)' 
                : '文章的主标题（必填）'
              }
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
              {isEnglish ? 'Description' : '描述'}
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder={isEnglish ? "Enter article description (optional)" : "输入文章描述（可选）"} 
                rows={3}
                {...field} 
                className="focus-visible:ring-gray-400 resize-none"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              {isEnglish 
                ? 'A brief summary of your article (optional)' 
                : '文章的简要摘要（可选）'
              }
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
                {isEnglish ? 'Category' : '分类'}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isEnglish ? "Enter category (optional)" : "输入分类（可选）"} 
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                {isEnglish 
                  ? 'Category of your article (optional)' 
                  : '文章分类（可选）'
                }
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
                {isEnglish ? 'Author' : '作者'}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isEnglish ? "Enter author name (optional)" : "输入作者姓名（可选）"} 
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                {isEnglish 
                  ? 'Name of the article author (optional)' 
                  : '文章作者姓名（可选）'
                }
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
              {isEnglish ? 'Publish Date' : '发布日期'}
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
              {isEnglish 
                ? 'When the article should be published' 
                : '文章应该发布的时间'
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MultilingualArticleBasicInfoSection;
