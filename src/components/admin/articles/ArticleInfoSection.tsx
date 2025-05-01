
import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Upload, User } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

// Available categories for selection
const CATEGORIES = [
  'Finance',
  'Investing',
  'Planning',
  'Markets',
  'Analysis',
  'Retirement',
  'Taxes',
  'Estate Planning'
];

interface Author {
  id: string;
  name: string;
}

interface ArticleInfoSectionProps {
  form: UseFormReturn<any>;
  authors: Author[];
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleAuthorChange: (authorId: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const ArticleInfoSection: React.FC<ArticleInfoSectionProps> = ({
  form,
  authors,
  selectedAuthors,
  handleAuthorChange,
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    Select one or multiple authors for this article
                  </FormDescription>
                  <div className="space-y-2">
                    {authors.map(author => (
                      <div 
                        key={author.id}
                        className={`flex items-center p-3 rounded-md border ${
                          selectedAuthors.includes(author.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-colors cursor-pointer`}
                        onClick={() => handleAuthorChange(author.id)}
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <User size={16} />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{author.name}</p>
                        </div>
                        <div>
                          {selectedAuthors.includes(author.id) && (
                            <Badge variant="outline" className="bg-primary text-white border-primary">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {authors.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No authors available. Add authors in the Author Management section.
                      </p>
                    )}
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
