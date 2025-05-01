
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, ImageIcon } from 'lucide-react';

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'list';
  content?: string;
  url?: string;
  caption?: string;
  items?: string[];
}

interface ContentEditorProps {
  content: ContentBlock[];
  onContentChange: (content: ContentBlock[]) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content, 
  onContentChange,
  onImageUpload 
}) => {
  const [currentContent, setCurrentContent] = useState('');
  const [contentType, setContentType] = useState<'paragraph' | 'heading'>('paragraph');

  const handleAddContent = () => {
    if (!currentContent.trim()) return;
    
    onContentChange([
      ...content,
      {
        type: contentType,
        content: currentContent
      }
    ]);
    
    setCurrentContent('');
  };

  const handleRemoveContentBlock = (index: number) => {
    const updatedContent = [...content];
    updatedContent.splice(index, 1);
    onContentChange(updatedContent);
  };

  const handleAddList = () => {
    const lines = currentContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    
    onContentChange([
      ...content,
      {
        type: 'list',
        items: lines
      }
    ]);
    
    setCurrentContent('');
  };

  // Render the content preview
  const renderContentPreview = (contentBlocks: ContentBlock[]) => {
    if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
      return <div className="text-muted-foreground italic">No content added yet</div>;
    }
    
    return contentBlocks.map((block, index) => (
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

  return (
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
              input.onchange = (e) => onImageUpload(e as any);
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
          {renderContentPreview(Array.isArray(content) ? content : [])}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
