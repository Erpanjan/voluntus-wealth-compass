
import React from 'react';
import { 
  Card,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
      <Accordion
        type="single" 
        collapsible 
        className="border-none"
        defaultValue="article-content"
      >
        <AccordionItem value="article-content" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Article Content</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent forceMount className="px-6 pb-6 data-[state=closed]:hidden">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default ArticleContentSection;
