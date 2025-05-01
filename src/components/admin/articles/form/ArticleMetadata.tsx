
import React from 'react';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface ArticleMetadataProps {
  form: UseFormReturn<any>;
  formValues: {
    category: string;
    published_at: string;
    author: string;
  };
  onChange: (field: string, value: any) => void;
}

const ArticleMetadata = ({ form, formValues, onChange }: ArticleMetadataProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter article category"
                  value={formValues.category}
                  onChange={(e) => onChange('category', e.target.value)}
                />
              </FormControl>
              <FormDescription>
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
              <FormLabel>Publish Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    className="pl-8"
                    value={formValues.published_at}
                    onChange={(e) => onChange('published_at', e.target.value)}
                  />
                </div>
              </FormControl>
              <FormDescription>
                When the article should be published
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter author name" 
                value={formValues.author}
                onChange={(e) => onChange('author', e.target.value)}
              />
            </FormControl>
            <FormDescription>
              The name of the article's author
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ArticleMetadata;
