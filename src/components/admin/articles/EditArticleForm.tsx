
import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import MultilingualArticleContentSection from '@/components/admin/articles/MultilingualArticleContentSection';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import MultilingualArticlePreviewDialog from '@/components/admin/articles/MultilingualArticlePreviewDialog';

interface EditArticleFormProps {
  form: any;
  selectedLanguage: 'en' | 'zh';
  setSelectedLanguage: (language: 'en' | 'zh') => void;
  hasContent: { en: boolean; zh: boolean };
  getCurrentFieldValue: (fieldName: string) => string;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
}

const EditArticleForm: React.FC<EditArticleFormProps> = ({
  form,
  selectedLanguage,
  setSelectedLanguage,
  hasContent,
  getCurrentFieldValue,
  imagePreview,
  fileInputRef,
  handleImageChange,
  handleRemoveImage,
  previewOpen,
  setPreviewOpen,
}) => {
  const formData = form.watch();

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <Card className="p-6 border-gray-200 shadow-sm">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          hasContent={hasContent}
        />
      </Card>

      {/* Article Information */}
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
                <h2 className="text-xl font-semibold text-gray-800">
                  Article Information
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 py-6 bg-white">
              <div className="space-y-8">
                <MultilingualArticleBasicInfoSection 
                  form={form} 
                  selectedLanguage={selectedLanguage}
                  getCurrentFieldValue={getCurrentFieldValue}
                />
                
                <div className="border-t border-gray-100 pt-8"></div>
                
                <ArticleImageUpload
                  imagePreview={imagePreview}
                  fileInputRef={fileInputRef}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      
      {/* Article Content */}
      <MultilingualArticleContentSection 
        form={form} 
        selectedLanguage={selectedLanguage}
        getCurrentFieldValue={getCurrentFieldValue}
      />

      <MultilingualArticlePreviewDialog
        open={previewOpen}
        setOpen={setPreviewOpen}
        content={{
          en: {
            title: formData?.en?.title || '',
            description: formData?.en?.description || '',
            content: formData?.en?.content || '',
            category: formData?.en?.category || '',
            author_name: formData?.en?.author_name || '',
          },
          zh: {
            title: formData?.zh?.title || '',
            description: formData?.zh?.description || '',
            content: formData?.zh?.content || '',
            category: formData?.zh?.category || '',
            author_name: formData?.zh?.author_name || '',
          }
        }}
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default EditArticleForm;
