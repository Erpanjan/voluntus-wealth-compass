
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Save, Eye, ArrowLeft } from 'lucide-react';
import TiptapEditor from './TiptapEditor';

interface EditFormData {
  en: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  zh: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  image_url: string;
  published_at: string;
}

interface SimpleEditFormProps {
  initialData: EditFormData;
  imagePreview: string;
  onImagePreviewChange: (url: string) => void;
  onSave: (data: EditFormData, imageFile?: File | null) => void;
  onPublish: (data: EditFormData, imageFile?: File | null) => void;
  onBack: () => void;
  saving: boolean;
}

const SimpleEditForm: React.FC<SimpleEditFormProps> = ({
  initialData,
  imagePreview,
  onImagePreviewChange,
  onSave,
  onPublish,
  onBack,
  saving
}) => {
  const [formData, setFormData] = useState<EditFormData>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'zh'>('en');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFieldChange = (lang: 'en' | 'zh', field: string, value: string | any) => {
    setFormData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        onImagePreviewChange(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    onImagePreviewChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave(formData, imageFile);
  };

  const handlePublish = () => {
    onPublish(formData, imageFile);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
          <h1 className="text-2xl font-semibold">Edit Article</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button onClick={handlePublish} disabled={saving}>
            <Eye className="h-4 w-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Language Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'zh')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="zh">中文</TabsTrigger>
            </TabsList>

            <TabsContent value="en" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="en-title">Title (English)</Label>
                  <Input
                    id="en-title"
                    value={formData.en.title}
                    onChange={(e) => handleFieldChange('en', 'title', e.target.value)}
                    placeholder="Enter article title in English"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="en-category">Category (English)</Label>
                  <Input
                    id="en-category"
                    value={formData.en.category}
                    onChange={(e) => handleFieldChange('en', 'category', e.target.value)}
                    placeholder="Enter category in English"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="en-author">Author (English)</Label>
                <Input
                  id="en-author"
                  value={formData.en.author_name}
                  onChange={(e) => handleFieldChange('en', 'author_name', e.target.value)}
                  placeholder="Enter author name in English"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="en-description">Description (English)</Label>
                <Textarea
                  id="en-description"
                  value={formData.en.description}
                  onChange={(e) => handleFieldChange('en', 'description', e.target.value)}
                  placeholder="Enter article description in English"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Content (English)</Label>
                <TiptapEditor
                  content={formData.en.content}
                  onChange={(content) => handleFieldChange('en', 'content', content)}
                  placeholder="Write your article content in English..."
                />
              </div>
            </TabsContent>

            <TabsContent value="zh" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zh-title">Title (中文)</Label>
                  <Input
                    id="zh-title"
                    value={formData.zh.title}
                    onChange={(e) => handleFieldChange('zh', 'title', e.target.value)}
                    placeholder="输入中文标题"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zh-category">Category (中文)</Label>
                  <Input
                    id="zh-category"
                    value={formData.zh.category}
                    onChange={(e) => handleFieldChange('zh', 'category', e.target.value)}
                    placeholder="输入中文分类"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zh-author">Author (中文)</Label>
                <Input
                  id="zh-author"
                  value={formData.zh.author_name}
                  onChange={(e) => handleFieldChange('zh', 'author_name', e.target.value)}
                  placeholder="输入中文作者名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zh-description">Description (中文)</Label>
                <Textarea
                  id="zh-description"
                  value={formData.zh.description}
                  onChange={(e) => handleFieldChange('zh', 'description', e.target.value)}
                  placeholder="输入中文描述"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Content (中文)</Label>
                <TiptapEditor
                  content={formData.zh.content}
                  onChange={(content) => handleFieldChange('zh', 'content', content)}
                  placeholder="输入中文内容..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label>Article Image</Label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Article preview"
                  className="max-w-md max-h-64 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload an image, or drag and drop
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Publishing Date */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="published-date">Publish Date</Label>
            <Input
              id="published-date"
              type="date"
              value={formData.published_at}
              onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleEditForm;
