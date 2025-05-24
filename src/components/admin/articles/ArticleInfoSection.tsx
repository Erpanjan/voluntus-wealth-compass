
import React from 'react';
import { Form } from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import ArticleBasicInfoSection from './ArticleBasicInfoSection';
import ArticleImageUpload from './ArticleImageUpload';

interface ArticleInfoSectionProps {
  form: UseFormReturn<any>;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const ArticleInfoSection: React.FC<ArticleInfoSectionProps> = ({
  form,
  imagePreview,
  fileInputRef,
  handleImageChange,
  handleRemoveImage
}) => {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <Accordion
        type="single" 
        collapsible 
        defaultValue="article-info"
        className="border-none"
      >
        <AccordionItem value="article-info" className="border-none">
          <AccordionTrigger className="px-6 py-5 hover:no-underline bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Article Information</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-8 py-6 bg-white">
            <Form {...form}>
              <form className="space-y-8">
                <ArticleBasicInfoSection form={form} />
                
                <div className="border-t border-gray-100 pt-8"></div>
                
                <ArticleImageUpload
                  imagePreview={imagePreview}
                  fileInputRef={fileInputRef}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default ArticleInfoSection;
