
import React from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import RichTextEditor from './RichTextEditor';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface ArticleContentSectionProps {
  form: UseFormReturn<any>;
}

const ArticleContentSection: React.FC<ArticleContentSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor 
                  value={field.value} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ArticleContentSection;
