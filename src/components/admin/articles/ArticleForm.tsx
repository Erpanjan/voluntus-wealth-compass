import React from 'react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useForm } from 'react-hook-form';

interface ArticleFormProps {
  formValues: {
    title: string;
    description: string;
    category: string;
    author: string;
    image_url: string;
    published_at: string;
  };
  onChange: (field: string, value: any) => void;
  htmlContent: string;
  setHtmlContent: (content: string) => void;
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
  loading: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  formValues,
  onChange,
  htmlContent,
  setHtmlContent,
  previewUrl,
  handleImageChange,
  loading
}) => {
  // This is just to keep compatibility with the form element
  const form = useForm({
    defaultValues: formValues
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
        <CardDescription>
          Edit your article content and metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter article title" 
                      value={formValues.title}
                      onChange={(e) => onChange('title', e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    The main title of your article
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter article description" 
                      rows={3}
                      value={formValues.description}
                      onChange={(e) => onChange('description', e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief summary of your article
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter article category"
                        value={formValues.category}
                        onChange={(e) => onChange('category', e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Category of your article (e.g. Finance, Investing)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="published_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="date"
                          className="pl-8"
                          value={formValues.published_at}
                          onChange={(e) => onChange('published_at', e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      When the article should be published
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Feature Image</Label>
              <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <div className="border border-input rounded-md p-2 bg-background">
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleImageChange(file);
                        }}
                        className="p-1"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload an image for your article (max 10MB)
                  </p>
                </div>
                {previewUrl && (
                  <div className="w-20 h-20 overflow-hidden rounded-md border">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter author name" 
                      value={formValues.author}
                      onChange={(e) => onChange('author', e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the article's author
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Article Content</Label>
              <RichTextEditor
                value={htmlContent}
                onChange={setHtmlContent}
              />
              <p className="text-sm text-muted-foreground">
                Create and format your article content
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ArticleForm;
