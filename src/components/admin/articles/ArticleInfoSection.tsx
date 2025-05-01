
import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Upload, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';

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
  const [newAuthor, setNewAuthor] = useState('');

  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      setSelectedAuthors(prev => [...prev, newAuthor.trim()]);
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setSelectedAuthors(prev => prev.filter(author => author !== authorToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAuthor();
    }
  };

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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter article title" 
                          {...field} 
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
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A brief summary of your article
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter article category" 
                            {...field} 
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
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                              type="date"
                              className="pl-10"
                              {...field}
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
                
                <div>
                  <FormLabel>Authors</FormLabel>
                  <FormDescription className="mb-3">
                    Add one or multiple authors for this article
                  </FormDescription>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedAuthors.map((author, index) => (
                      <Badge 
                        key={`${author}-${index}`} 
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5"
                      >
                        {author}
                        <button 
                          type="button"
                          className="ml-1 hover:bg-gray-200 rounded-full p-1"
                          onClick={() => handleRemoveAuthor(author)}
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter author name"
                      className="flex-grow"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddAuthor}
                      variant="outline"
                    >
                      <Plus size={16} className="mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                
                <div>
                  <FormLabel>Feature Image</FormLabel>
                  <FormDescription className="mb-3">
                    Upload an image for your article (max 10MB)
                  </FormDescription>
                  
                  {imagePreview ? (
                    <div className="relative rounded-md overflow-hidden border border-gray-200 mb-2">
                      <img 
                        src={imagePreview} 
                        alt="Article feature" 
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max 10MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default ArticleInfoSection;
