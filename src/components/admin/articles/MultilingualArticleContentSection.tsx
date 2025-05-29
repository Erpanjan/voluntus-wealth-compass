
import React from 'react';
import { Card } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import TiptapEditor from './TiptapEditor';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Language = 'en' | 'zh';

interface MultilingualArticleContentSectionProps {
  form: UseFormReturn<any>;
  selectedLanguage: Language;
}

const MultilingualArticleContentSection: React.FC<MultilingualArticleContentSectionProps> = ({ 
  form, 
  selectedLanguage 
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Article Content
            </h2>
          </div>
          <CollapsibleTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent 
          className="bg-white"
          forceMount
        >
          <div className={`${isOpen ? 'block' : 'hidden'} p-6`}>
            <FormField
              control={form.control}
              name={`${selectedLanguage}.content`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TiptapEditor 
                      key={`${selectedLanguage}-editor`}
                      value={field.value || ''} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default MultilingualArticleContentSection;
