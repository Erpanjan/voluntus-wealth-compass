
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
import ArticleAuthorsSection from './ArticleAuthorsSection';
import ArticleImageUpload from './ArticleImageUpload';

interface ArticleInfoSectionProps {
  form: UseFormReturn<any>;
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const ArticleInfoSection: React.FC<ArticleInfoSectionProps> = ({
  form,
  selectedAuthors,
  setSelectedAuthors,
  imagePreview,
  fileInputRef,
  handleImageChange,
  handleRemoveImage
}) => {
  return (
    <Card>
      <Accordion
        type="single" 
        collapsible 
        defaultValue="article-info"
        className="border-none"
      >
        <AccordionItem value="article-info" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Article Information</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <Form {...form}>
              <form className="space-y-6">
                <ArticleBasicInfoSection form={form} />
                
                <ArticleAuthorsSection
                  selectedAuthors={selectedAuthors}
                  setSelectedAuthors={setSelectedAuthors}
                />
                
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
