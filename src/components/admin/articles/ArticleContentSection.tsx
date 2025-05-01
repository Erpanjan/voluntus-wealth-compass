
import React from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Separator } from '@/components/ui/separator';

interface ArticleContentSectionProps {
  form: UseFormReturn<any>;
}

const ArticleContentSection: React.FC<ArticleContentSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
        <CardDescription>
          Write your article content using the rich text editor below. You can format text, add headings, insert images and links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><span className="font-semibold">Tip:</span> Use headings for structure</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="flex items-center gap-1"><span className="font-semibold">Tip:</span> Insert images to make your article engaging</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="flex items-center gap-1"><span className="font-semibold">Tip:</span> Highlight text to format it</span>
        </div>
        
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
