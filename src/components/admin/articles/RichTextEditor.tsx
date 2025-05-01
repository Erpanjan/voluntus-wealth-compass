import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading, 
  List, 
  ListOrdered, 
  Image 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(value || '');
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Apply formatting to selected text
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    
    if (editorRef.current) {
      // Update the form value
      onChange(editorRef.current.innerHTML);
    }
    // Ensure editor keeps focus
    editorRef.current?.focus();
  };

  // Insert an image
  const handleImageInsertion = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      applyFormat('insertImage', imageUrl);
    }
  };

  // Handle content change
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorState(newContent);
      onChange(newContent);
    }
  };

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden">
      <div className="toolbar bg-muted p-2 border-b flex flex-wrap items-center gap-1">
        <Button 
          onClick={() => applyFormat('bold')} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button 
          onClick={() => applyFormat('italic')} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button 
          onClick={() => applyFormat('underline')} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline size={16} />
        </Button>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 flex items-center gap-1"
            >
              <Heading size={16} />
              <span>Heading</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h1')}>
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h2')}>
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h3')}>
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'p')}>
              Paragraph
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <Button 
          onClick={() => applyFormat('insertUnorderedList')} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button 
          onClick={() => applyFormat('insertOrderedList')} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <Button 
          onClick={handleImageInsertion} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Insert Image"
        >
          <Image size={16} />
        </Button>
      </div>
      
      <div
        ref={editorRef}
        className="content p-4 min-h-[300px] focus:outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorState }}
        onBlur={handleContentChange}
        onInput={handleContentChange}
      />
    </div>
  );
};

export default RichTextEditor;
