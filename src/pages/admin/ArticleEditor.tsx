import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Save, ArrowLeft, Upload, Plus, X, Trash2, ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Author {
  id: string;
  name: string;
}

interface Article {
  id?: string;
  title: string;
  description: string;
  content: any;
  category: string;
  image_url?: string;
  authors?: Author[];
}

// Sample content block types
interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'list';
  content?: string;
  url?: string;
  caption?: string;
  items?: string[];
}

const fetchAuthors = async () => {
  const { data, error } = await supabase
    .from('authors')
    .select('id, name');
  
  if (error) throw error;
  return data || [];
};

const fetchArticle = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Fetch authors for this article
  const { data: articleAuthors, error: authorsError } = await supabase
    .from('article_authors')
    .select('author_id')
    .eq('article_id', id);
  
  if (authorsError) throw authorsError;
  
  return {
    ...data,
    authorIds: articleAuthors?.map(aa => aa.author_id) || []
  };
};

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewArticle = id === 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [article, setArticle] = useState<Article>({
    title: '',
    description: '',
    content: [],
    category: 'RESEARCH & INSIGHTS',
    image_url: ''
  });
  
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFiles, setReportFiles] = useState<{ file: File, title: string, description: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Text editor state (simplified for demonstration)
  const [currentContent, setCurrentContent] = useState('');
  const [contentType, setContentType] = useState<'paragraph' | 'heading'>('paragraph');
  
  // Fetch authors for the dropdown
  const { data: authors, isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors
  });
  
  // Fetch article data if editing
  const { data: existingArticle, isLoading: articleLoading } = useQuery({
    queryKey: ['edit-article', id],
    queryFn: () => fetchArticle(id!),
    enabled: !isNewArticle && !!id,
    onSuccess: (data) => {
      if (data) {
        setArticle({
          id: data.id,
          title: data.title,
          description: data.description,
          content: data.content || [],
          category: data.category,
          image_url: data.image_url
        });
        setSelectedAuthorIds(data.authorIds || []);
      }
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAuthorSelection = (authorId: string) => {
    setSelectedAuthorIds(prev => {
      if (prev.includes(authorId)) {
        return prev.filter(id => id !== authorId);
      } else {
        return [...prev, authorId];
      }
    });
  };
  
  const handleAddContent = () => {
    if (!currentContent.trim()) return;
    
    setArticle(prev => ({
      ...prev,
      content: [
        ...(Array.isArray(prev.content) ? prev.content : []),
        {
          type: contentType,
          content: currentContent
        }
      ]
    }));
    
    setCurrentContent('');
  };
  
  const handleRemoveContentBlock = (index: number) => {
    setArticle(prev => ({
      ...prev,
      content: [
        ...(Array.isArray(prev.content) ? prev.content : []).filter((_, i) => i !== index)
      ]
    }));
  };
  
  const handleAddList = () => {
    const lines = currentContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    
    setArticle(prev => ({
      ...prev,
      content: [
        ...(Array.isArray(prev.content) ? prev.content : []),
        {
          type: 'list',
          items: lines
        }
      ]
    }));
    
    setCurrentContent('');
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadProgress(1); // Start progress
      
      // Upload the image to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `article-images/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });
      
      if (error) throw error;
      
      setUploadProgress(50); // Mid progress
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      setUploadProgress(100); // Complete
      
      // Add to content blocks if we're adding content
      if (data) {
        setArticle(prev => ({
          ...prev,
          content: [
            ...(Array.isArray(prev.content) ? prev.content : []),
            {
              type: 'image',
              url: publicUrl,
              caption: 'Image caption'
            }
          ]
        }));
      } else {
        // Otherwise set as the main article image
        setArticle(prev => ({
          ...prev,
          image_url: publicUrl
        }));
      }
      
      toast.success('Image uploaded successfully');
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };
  
  const handleAddReport = () => {
    setReportFiles(prev => [
      ...prev, 
      { file: new File([], ""), title: "", description: "" }
    ]);
  };
  
  const handleReportChange = (index: number, field: string, value: any) => {
    setReportFiles(prev => {
      const newReports = [...prev];
      newReports[index] = { ...newReports[index], [field]: value };
      return newReports;
    });
  };
  
  const handleReportFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setReportFiles(prev => {
      const newReports = [...prev];
      newReports[index] = { ...newReports[index], file };
      return newReports;
    });
  };
  
  const handleRemoveReport = (index: number) => {
    setReportFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!article.title || !article.description) {
      toast.error('Title and description are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Insert or update article
      let articleId = article.id;
      
      if (isNewArticle) {
        // Create new article
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: article.title,
            description: article.description,
            content: article.content,
            category: article.category,
            image_url: article.image_url
          })
          .select('id')
          .single();
        
        if (error) throw error;
        articleId = data.id;
      } else {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update({
            title: article.title,
            description: article.description,
            content: article.content,
            category: article.category,
            image_url: article.image_url
          })
          .eq('id', article.id);
        
        if (error) throw error;
      }
      
      // If we have an article ID, handle authors and reports
      if (articleId) {
        // First delete existing author links
        await supabase
          .from('article_authors')
          .delete()
          .eq('article_id', articleId);
        
        // Then create new author links
        if (selectedAuthorIds.length > 0) {
          const authorLinks = selectedAuthorIds.map(authorId => ({
            article_id: articleId,
            author_id: authorId
          }));
          
          const { error } = await supabase
            .from('article_authors')
            .insert(authorLinks);
          
          if (error) throw error;
        }
        
        // Handle report uploads
        for (const reportData of reportFiles) {
          if (reportData.file && reportData.file.size > 0 && reportData.title) {
            // Upload the file
            const fileExt = reportData.file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `reports/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('public')
              .upload(filePath, reportData.file, {
                contentType: reportData.file.type,
                upsert: true
              });
            
            if (uploadError) throw uploadError;
            
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('public')
              .getPublicUrl(filePath);
            
            // Create the report entry
            const { error } = await supabase
              .from('reports')
              .insert({
                title: reportData.title,
                description: reportData.description,
                file_url: publicUrl,
                article_id: articleId
              });
            
            if (error) throw error;
          }
        }
      }
      
      toast.success(isNewArticle ? 'Article created successfully' : 'Article updated successfully');
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Error saving article');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the content preview
  const renderContentPreview = (content: ContentBlock[]) => {
    if (!Array.isArray(content) || content.length === 0) {
      return <div className="text-muted-foreground italic">No content added yet</div>;
    }
    
    return content.map((block, index) => (
      <div key={index} className="group relative p-4 border rounded-md mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleRemoveContentBlock(index)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {block.type === 'paragraph' && (
          <p className="text-base">{block.content}</p>
        )}
        
        {block.type === 'heading' && (
          <h3 className="text-xl font-semibold">{block.content}</h3>
        )}
        
        {block.type === 'image' && (
          <div className="text-center">
            <img src={block.url} alt={block.caption} className="mx-auto max-h-48 rounded" />
            <p className="text-sm text-muted-foreground mt-2">{block.caption}</p>
          </div>
        )}
        
        {block.type === 'list' && (
          <ul className="list-disc pl-6 space-y-1">
            {block.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    ));
  };
  
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
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter article title"
                    value={article.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="E.g., RESEARCH & INSIGHTS, NEWS, PEOPLE"
                    value={article.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description/Summary</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a brief description of the article"
                    value={article.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="image_url">Featured Image</Label>
                  <div className="flex items-start gap-4 mt-2">
                    {article.image_url && (
                      <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                        <img 
                          src={article.image_url} 
                          alt="Featured" 
                          className="object-cover w-full h-full" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => setArticle(prev => ({ ...prev, image_url: '' }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload a featured image for the article (recommended size: 1200x630px)
                      </p>
                      
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{width: `${uploadProgress}%`}}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Author Selection */}
            <div className="space-y-2">
              <Label>Select Authors</Label>
              {authorsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Array(6).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {authors?.map(author => (
                    <div 
                      key={author.id}
                      className={`p-2 border rounded cursor-pointer ${
                        selectedAuthorIds.includes(author.id) 
                          ? 'bg-blue-100 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleAuthorSelection(author.id)}
                    >
                      {author.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content Editor */}
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="text-lg font-medium">Article Content</h3>
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <select 
                    className="border p-2 rounded-md text-sm"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="heading">Heading</option>
                  </select>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleImageUpload(e as any);
                      input.click();
                    }}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddList}
                  >
                    Add List
                  </Button>
                </div>
                
                <Textarea
                  placeholder={contentType === 'paragraph' ? "Enter paragraph text..." : "Enter heading text..."}
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  rows={contentType === 'paragraph' ? 4 : 1}
                />
                
                <Button
                  type="button"
                  onClick={handleAddContent}
                  disabled={!currentContent.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Content Block
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  For lists, enter each item on a new line, then click "Add List" button.
                </p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Content Preview</h4>
                <div className="bg-gray-50 p-4 rounded-md min-h-[200px]">
                  {renderContentPreview(Array.isArray(article.content) ? article.content : [])}
                </div>
              </div>
            </div>
            
            {/* Report Uploads */}
            <div className="space-y-4 border rounded-md p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Reports</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddReport}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Report
                </Button>
              </div>
              
              {reportFiles.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No reports added</p>
              ) : (
                <div className="space-y-4">
                  {reportFiles.map((report, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveReport(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor={`report-title-${index}`}>Report Title</Label>
                          <Input
                            id={`report-title-${index}`}
                            value={report.title}
                            onChange={(e) => handleReportChange(index, 'title', e.target.value)}
                            placeholder="Enter report title"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`report-desc-${index}`}>Description (Optional)</Label>
                          <Input
                            id={`report-desc-${index}`}
                            value={report.description}
                            onChange={(e) => handleReportChange(index, 'description', e.target.value)}
                            placeholder="Enter report description"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`report-file-${index}`}>Report File</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf,.docx,.xlsx,.pptx';
                                input.onchange = (e) => handleReportFileChange(index, e as any);
                                input.click();
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" /> Select File
                            </Button>
                            <span className="text-sm">
                              {report.file.name || 'No file selected'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
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
