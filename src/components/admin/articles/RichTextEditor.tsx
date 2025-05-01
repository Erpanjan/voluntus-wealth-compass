
import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link,
  Heading, 
  List, 
  ListOrdered, 
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { insertImageIntoEditor } from '@/utils/imageUtils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(value || '');
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply formatting to selected text
  const applyFormat = useCallback((command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    
    if (editorRef.current) {
      // Update the form value
      onChange(editorRef.current.innerHTML);
    }
    // Ensure editor keeps focus
    editorRef.current?.focus();
  }, [onChange]);

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorState(newContent);
      onChange(newContent);
    }
  }, [onChange]);

  // Insert Link
  const handleLinkInsertion = useCallback(() => {
    if (!linkUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    // Add http:// if protocol is missing
    let url = linkUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }

    applyFormat('createLink', url);
    setLinkUrl('');
    setLinkPopoverOpen(false);
  }, [linkUrl, applyFormat]);

  // Insert an image from URL
  const handleImageUrlInsertion = useCallback(() => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    insertImageIntoEditor(editorRef, imageUrl, onChange);
    setImageUrl('');
    setImagePopoverOpen(false);
  }, [imageUrl, onChange]);

  // Insert an image from file upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File must be an image",
        variant: "destructive"
      });
      return;
    }

    // Create a preview URL and insert it
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        insertImageIntoEditor(editorRef, reader.result, onChange);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden bg-white shadow-sm">
      <ScrollArea className="toolbar bg-[#F6F6F7] p-3 border-b flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 flex-wrap">
          <Button 
            onClick={() => applyFormat('bold')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Bold"
          >
            <Bold size={16} />
          </Button>
          <Button 
            onClick={() => applyFormat('italic')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Italic"
          >
            <Italic size={16} />
          </Button>
          <Button 
            onClick={() => applyFormat('underline')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Underline"
          >
            <Underline size={16} />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 flex items-center gap-1 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
              >
                <Heading size={16} />
                <span>Heading</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h1')}>
                <span className="text-xl font-semibold">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h2')}>
                <span className="text-lg font-semibold">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h3')}>
                <span className="text-base font-semibold">Heading 3</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'p')}>
                <span className="text-sm">Paragraph</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            onClick={() => applyFormat('insertUnorderedList')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Bullet List"
          >
            <List size={16} />
          </Button>
          
          <Button 
            onClick={() => applyFormat('insertOrderedList')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            onClick={() => applyFormat('justifyLeft')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Align Left"
          >
            <AlignLeft size={16} />
          </Button>
          
          <Button 
            onClick={() => applyFormat('justifyCenter')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Align Center"
          >
            <AlignCenter size={16} />
          </Button>
          
          <Button 
            onClick={() => applyFormat('justifyRight')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Align Right"
          >
            <AlignRight size={16} />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
                title="Insert Link"
              >
                <Link size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Insert Link</h4>
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleLinkInsertion}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
                title="Insert Image"
              >
                <Image size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium">Insert Image</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">From URL</p>
                  <Input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={handleImageUrlInsertion}
                    >
                      Insert
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Upload Image</p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Button 
            onClick={() => applyFormat('undo')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Undo"
          >
            <Undo size={16} />
          </Button>
          
          <Button 
            onClick={() => applyFormat('redo')} 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
            title="Redo"
          >
            <Redo size={16} />
          </Button>
        </div>
      </ScrollArea>
      
      <div
        ref={editorRef}
        className="content p-5 min-h-[400px] focus:outline-none prose max-w-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorState }}
        onBlur={handleContentChange}
        onInput={handleContentChange}
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#333333'
        }}
      />
    </div>
  );
};

export default RichTextEditor;
