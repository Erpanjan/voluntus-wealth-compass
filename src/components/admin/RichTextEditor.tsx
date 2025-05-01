
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css'; 
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Image, Link, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, Underline } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  placeholder = 'Start typing your content here...'
}) => {
  // For SSR compatibility
  const [mounted, setMounted] = useState(false);
  const [focusedFormat, setFocusedFormat] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // For a11y keyboard shortcuts
  const handleKeyboardShortcut = (format: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setFocusedFormat(format);
    // Visual feedback only - ReactQuill handles the actual shortcuts
  };

  const QuillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function() {
            return true; // Let default tab behavior work
          }
        }
      }
    }
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  // Custom toolbar with accessible buttons
  const CustomToolbar = () => (
    <div className="rich-text-custom-toolbar" role="toolbar" aria-label="Formatting options">
      <div className="format-group">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('bold')}
          aria-label="Bold" 
          aria-pressed={focusedFormat === 'bold'}
          className="format-button"
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('italic')}
          aria-label="Italic" 
          aria-pressed={focusedFormat === 'italic'}
          className="format-button"
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('underline')}
          aria-label="Underline" 
          aria-pressed={focusedFormat === 'underline'}
          className="format-button"
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </Button>
      </div>
      
      <div className="format-group">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('header-1')}
          aria-label="Heading 1" 
          className="format-button"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('header-2')}
          aria-label="Heading 2" 
          className="format-button"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>
      </div>
      
      <div className="format-group">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('list')}
          aria-label="Bullet List" 
          className="format-button"
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('list-ordered')}
          aria-label="Numbered List" 
          className="format-button"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
      </div>
      
      <div className="format-group">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('align-left')}
          aria-label="Align Left" 
          className="format-button"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('align-center')}
          aria-label="Align Center" 
          className="format-button"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('align-right')}
          aria-label="Align Right" 
          className="format-button"
          title="Align Right"
        >
          <AlignRight size={16} />
        </Button>
      </div>
      
      <div className="format-group">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('link')}
          aria-label="Insert Link" 
          className="format-button"
          title="Insert Link (Ctrl+K)"
        >
          <Link size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleKeyboardShortcut('image')}
          aria-label="Insert Image" 
          className="format-button"
          title="Insert Image"
        >
          <Image size={16} />
        </Button>
      </div>
    </div>
  );

  if (!mounted) {
    return (
      <div className="rich-editor-placeholder border rounded-md p-4 bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rich-editor-container">
      <CustomToolbar />
      <div className="rich-text-editor-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={QuillModules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[400px]"
        />
      </div>
      <div className="editor-stats flex justify-between text-xs text-muted-foreground mt-2">
        <div className="keyboard-shortcuts">
          <span className="shortcut">Ctrl+B: Bold</span> &middot; 
          <span className="shortcut">Ctrl+I: Italic</span> &middot; 
          <span className="shortcut">Ctrl+U: Underline</span> &middot; 
          <span className="shortcut">Ctrl+K: Link</span>
        </div>
        <div className="word-count">
          <span>{countWords(value)} words</span> &middot; 
          <span>{countChars(value)} characters</span> &middot; 
          <span>~{Math.ceil(countWords(value) / 200)} min read</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to count words in the editor
const countWords = (html: string): number => {
  if (!html) return 0;
  // Remove HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ');
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

// Helper function to count characters excluding HTML tags
const countChars = (html: string): number => {
  if (!html) return 0;
  // Remove HTML tags and count characters
  const text = html.replace(/<[^>]*>/g, ' ');
  return text.replace(/\s+/g, ' ').trim().length;
};

export default RichTextEditor;
