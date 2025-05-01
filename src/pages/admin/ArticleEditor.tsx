
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import AuthorSelector from '@/components/admin/article/AuthorSelector';
import ContentEditor from '@/components/admin/article/ContentEditor';
import ReportsManager from '@/components/admin/article/ReportsManager';
import BasicArticleInfo from '@/components/admin/article/BasicArticleInfo';
import useArticleEditor from '@/hooks/useArticleEditor';

const ArticleEditor = () => {
  const {
    isNewArticle,
    fileInputRef,
    article,
    selectedAuthorIds,
    isSubmitting,
    reportFiles,
    uploadProgress,
    authors,
    authorsLoading,
    articleLoading,
    handleInputChange,
    handleImageChange,
    handleAuthorSelection,
    handleContentChange,
    handleImageUpload,
    handleAddReport,
    handleReportChange,
    handleReportFileChange,
    handleRemoveReport,
    handleSubmit,
    navigate
  } = useArticleEditor();
  
  if (!isNewArticle && articleLoading) {
    return (
      <div className="container-custom py-12">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {isNewArticle ? 'Create New Article' : 'Edit Article'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isNewArticle ? 'Add a new market insight article' : 'Update market insight article'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/articles')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Article Info */}
            <BasicArticleInfo 
              title={article.title}
              category={article.category}
              description={article.description}
              imageUrl={article.image_url}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              onImageUpload={handleImageUpload}
              uploadProgress={uploadProgress}
              fileInputRef={fileInputRef}
            />
            
            {/* Author Selection */}
            <div className="space-y-2">
              <Label>Select Authors</Label>
              <AuthorSelector 
                authors={authors} 
                selectedAuthorIds={selectedAuthorIds}
                onAuthorSelection={handleAuthorSelection}
                isLoading={authorsLoading}
              />
            </div>
            
            {/* Content Editor */}
            <ContentEditor 
              content={Array.isArray(article.content) ? article.content : []}
              onContentChange={handleContentChange}
              onImageUpload={handleImageUpload}
            />
            
            {/* Report Uploads */}
            <ReportsManager 
              reports={reportFiles}
              onAddReport={handleAddReport}
              onRemoveReport={handleRemoveReport}
              onReportChange={handleReportChange}
              onReportFileChange={handleReportFileChange}
            />
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : (isNewArticle ? 'Create Article' : 'Update Article')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleEditor;
