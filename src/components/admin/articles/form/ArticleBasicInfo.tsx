
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
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface ArticleBasicInfoProps {
  form: UseFormReturn<any>;
  formValues: {
    title: string;
    description: string;
  };
  onChange: (field: string, value: any) => void;
}

const ArticleBasicInfo = ({ form, formValues, onChange }: ArticleBasicInfoProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter article title" 
                value={formValues.title}
                onChange={(e) => onChange('title', e.target.value)}
                required
              />
            </FormControl>
            <FormDescription>
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter article description" 
                rows={3}
                value={formValues.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="resize-none"
                required
              />
            </FormControl>
            <FormDescription>
              A brief summary of your article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ArticleBasicInfo;
