
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useMultilingualForm } from '@/hooks/admin/articleEditor/useMultilingualForm';
import { useArticleImage } from '@/hooks/admin/articleEditor/useArticleImage';
import { useArticlePreview } from '@/hooks/admin/articleEditor/useArticlePreview';
import { useToast } from '@/hooks/use-toast';
import { unifiedArticleService } from '@/services/article/unifiedArticleService';
import LanguageSelector from '@/components/admin/articles/LanguageSelector';
import MultilingualArticleBasicInfoSection from '@/components/admin/articles/MultilingualArticleBasicInfoSection';
import MultilingualArticleContentSection from '@/components/admin/articles/MultilingualArticleContentSection';
import ArticleImageUpload from '@/components/admin/articles/ArticleImageUpload';
import ArticleEditorToolbar from '@/components/admin/articles/ArticleEditorToolbar';
import MultilingualArticlePreviewDialog from '@/components/admin/articles/MultilingualArticlePreviewDialog';
import { useEditArticleActions } from '@/hooks/admin/articleEditor/useEditArticleActions';

// Enhanced helper function to convert content to HTML string
const convertContentToHtml = (content: any): string => {
  if (!content) return '';
  
  console.log('🔍 Converting content:', { type: typeof content, value: content });
  
  // If it's already a string, return it
  if (typeof content === 'string') {
    return content;
  }
  
  // Handle the specific structure we see in the logs: { _type: "String", value: "..." }
  if (typeof content === 'object' && content._type === 'String' && content.value) {
    console.log('✅ Found _type: String structure, extracting value');
    return content.value;
  }
  
  // If it's an object with an html property, use that
  if (typeof content === 'object' && content.html) {
    console.log('✅ Found html property, using it');
    return content.html;
  }
  
  // If it's a Tiptap/ProseMirror document, try to extract text content
  if (typeof content === 'object' && content.type === 'doc' && content.content) {
    console.log('✅ Found ProseMirror document structure');
    // For now, return a simple paragraph - in a real app you'd use Tiptap's generateHTML
    return '<p></p>';
  }
  
  // If it's any other object, stringify it as fallback
  if (typeof content === 'object') {
    console.log('⚠️ Unknown object structure, stringifying');
    return JSON.stringify(content);
  }
  
  console.log('⚠️ Unknown content type, returning empty string');
  return '';
};

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { 
    form, 
    selectedLanguage, 
    setSelectedLanguage, 
    hasContent,
    getCurrentFieldValue,
  } = useMultilingualForm();
  
  const { 
    imageFile, setImageFile, 
    imagePreview, setImagePreview, 
    fileInputRef, handleImageChange, handleRemoveImage, loadImageData 
  } = useArticleImage();
  
  const { previewOpen, setPreviewOpen, openPreview } = useArticlePreview();
  const { submitting, navigateBack, updateDraft, updateAndPublish } = useEditArticleActions(id);

  // Load article data ONCE on mount
  useEffect(() => {
    const loadArticleData = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'No article ID provided',
          variant: 'destructive',
        });
        navigateBack();
        return;
      }

      try {
        console.log(`🔍 Loading article data for ID: ${id}`);
        
        const article = await unifiedArticleService.getMultilingualArticleById(id);

        if (!article) {
          toast({
            title: 'Article Not Found',
            description: 'Could not find the article you are trying to edit.',
            variant: 'destructive',
          });
          navigateBack();
          return;
        }

        console.log(`📊 Loaded article data:`, article);

        // Load existing image if available
        if (article.image_url) {
          loadImageData(article.image_url);
        }

        // Convert content to HTML strings for proper editing
        const convertedContentEn = convertContentToHtml(article.content_en);
        const convertedContentZh = convertContentToHtml(article.content_zh);

        console.log('📝 Converting content:', {
          originalEn: article.content_en,
          convertedEn: convertedContentEn,
          originalZh: article.content_zh,
          convertedZh: convertedContentZh
        });

        // Populate form with article data - this happens ONCE
        const formData = {
          en: {
            title: article.title_en || '',
            description: article.description_en || '',
            content: convertedContentEn,
            category: article.category_en || '',
            author_name: article.author_name_en || '',
          },
          zh: {
            title: article.title_zh || '',
            description: article.description_zh || '',
            content: convertedContentZh,
            category: article.category_zh || '',
            author_name: article.author_name_zh || '',
          },
          image_url: article.image_url || '',
          published_at: article.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        };

        console.log(`✅ Setting form data once:`, formData);
        form.reset(formData);

      } catch (error) {
        console.error('💥 Error loading article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article data. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadArticleData();
  }, [id]); // Only depend on id, not form or other dependencies

  const handleSaveDraft = async () => {
    const formData = form.getValues();
    await updateDraft({ ...formData, image_url: imagePreview }, imageFile);
  };

  const handlePublishArticle = async () => {
    const formData = form.getValues();
    await updateAndPublish({ ...formData, image_url: imagePreview }, imageFile);
  };

  // Get all form data for preview
  const formData = form.watch();

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-16">
        <ArticleEditorToolbar 
          isEditMode={true}
          submitting={submitting}
          onBack={navigateBack}
          onPreview={openPreview}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublishArticle}
        />
        
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
        </div>

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
    </AdminLayout>
  );
};

export default EditArticle;
