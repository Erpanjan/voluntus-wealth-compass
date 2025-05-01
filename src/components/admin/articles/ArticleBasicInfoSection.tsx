
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

interface ArticleBasicInfoSectionProps {
  form: UseFormReturn<any>;
}

const ArticleBasicInfoSection: React.FC<ArticleBasicInfoSectionProps> = ({
  form
}) => {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter article title" 
                {...field} 
                className="focus-visible:ring-gray-400"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              The main title of your article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 text-base">Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter article description" 
                rows={3}
                {...field} 
                className="focus-visible:ring-gray-400 resize-none"
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              A brief summary of your article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-base">Category</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter article category" 
                  {...field} 
                  className="focus-visible:ring-gray-400"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Category of your article (e.g. Finance, Investing)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
              <FormDescription className="text-gray-500">
                When the article should be published
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ArticleBasicInfoSection;
