
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

// Simplified content conversion function focused on HTML strings
const convertContentToHtml = (content: any): string => {
  console.log('🔍 [CONTENT DEBUG] Converting content:', { 
    type: typeof content, 
    isString: typeof content === 'string',
    isObject: typeof content === 'object',
    value: content 
  });
  
  // Handle null/undefined
  if (!content) {
    console.log('📝 [CONTENT DEBUG] Content is null/undefined, returning empty string');
    return '';
  }
  
  // Priority 1: Handle direct HTML strings (most common case from our database)
  if (typeof content === 'string') {
    console.log('✅ [CONTENT DEBUG] Content is string, returning as-is:', content.substring(0, 100) + '...');
    return content;
  }
  
  // Priority 2: Handle object with _type: "String" structure
  if (typeof content === 'object' && content._type === 'String' && content.value) {
    console.log('✅ [CONTENT DEBUG] Found _type: String structure, extracting value');
    return content.value;
  }
  
  // Priority 3: Handle object with html property
  if (typeof content === 'object' && content.html) {
    console.log('✅ [CONTENT DEBUG] Found html property, using it');
    return content.html;
  }
  
  // Priority 4: Handle Tiptap/ProseMirror document structure
  if (typeof content === 'object' && content.type === 'doc' && content.content) {
    console.log('✅ [CONTENT DEBUG] Found ProseMirror document structure');
    return '<p></p>'; // Simple fallback for complex docs
  }
  
  // Fallback: Convert unknown objects to string
  if (typeof content === 'object') {
    console.log('⚠️ [CONTENT DEBUG] Unknown object structure, stringifying');
    return JSON.stringify(content);
  }
  
  console.log('⚠️ [CONTENT DEBUG] Unknown content type, returning empty string');
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
        console.log(`🔍 [LOAD DEBUG] Loading article data for ID: ${id}`);
        
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

        console.log(`📊 [LOAD DEBUG] Loaded article data:`, {
          id: article.id,
          title_en: article.title_en,
          title_zh: article.title_zh,
          content_en_type: typeof article.content_en,
          content_zh_type: typeof article.content_zh,
          content_en_preview: typeof article.content_en === 'string' ? article.content_en.substring(0, 100) : article.content_en,
          content_zh_preview: typeof article.content_zh === 'string' ? article.content_zh.substring(0, 100) : article.content_zh
        });

        // Load existing image if available
        if (article.image_url) {
          loadImageData(article.image_url);
        }

        // Convert content to HTML strings for proper editing
        const convertedContentEn = convertContentToHtml(article.content_en);
        const convertedContentZh = convertContentToHtml(article.content_zh);

        console.log('📝 [LOAD DEBUG] Content conversion results:', {
          originalEn: article.content_en,
          convertedEn: convertedContentEn.substring(0, 100) + '...',
          originalZh: article.content_zh,
          convertedZh: convertedContentZh.substring(0, 100) + '...'
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

        console.log(`✅ [LOAD DEBUG] Setting form data:`, {
          en_content_length: formData.en.content.length,
          zh_content_length: formData.zh.content.length,
          en_content_preview: formData.en.content.substring(0, 100) + '...',
          zh_content_preview: formData.zh.content.substring(0, 100) + '...'
        });
        
        form.reset(formData);

        // Verify the form was set correctly
        setTimeout(() => {
          const currentValues = form.getValues();
          console.log('🔍 [VERIFICATION] Form values after reset:', {
            en_content_length: currentValues.en?.content?.length || 0,
            zh_content_length: currentValues.zh?.content?.length || 0,
            en_content_preview: currentValues.en?.content?.substring(0, 100) + '...',
            zh_content_preview: currentValues.zh?.content?.substring(0, 100) + '...'
          });
        }, 100);

      } catch (error) {
        console.error('💥 [LOAD ERROR] Error loading article:', error);
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
