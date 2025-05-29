
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SimpleEditForm from '@/components/admin/articles/SimpleEditForm';
import { useSimpleEditHook } from '@/hooks/admin/useSimpleEditHook';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const NewArticleEditor = () => {
  const {
    loading,
    saving,
    articleData,
    imagePreview,
    setImagePreview,
    loadArticle,
    saveArticle,
    publishArticle,
    navigateBack
  } = useSimpleEditHook();

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!articleData) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Article Not Found</h2>
            <p className="text-gray-600">The article you are trying to edit could not be found.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SimpleEditForm
        initialData={articleData}
        imagePreview={imagePreview}
        onImagePreviewChange={setImagePreview}
        onSave={saveArticle}
        onPublish={publishArticle}
        onBack={navigateBack}
        saving={saving}
      />
    </AdminLayout>
  );
};

export default NewArticleEditor;
