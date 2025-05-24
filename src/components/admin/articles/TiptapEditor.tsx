import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import EditorToolbar from './editor/EditorToolbar';
import { useAutosave } from '@/hooks/useAutosave';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  autosave?: boolean;
  onAutosave?: (content: string) => Promise<void>;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  value, 
  onChange, 
  autosave = false, 
  onAutosave 
}) => {
  // State for toolbar controls
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPopoverOpen, setVideoPopoverOpen] = useState(false);
  const [fontOptionsOpen, setFontOptionsOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [lineHeightPopoverOpen, setLineHeightPopoverOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg my-4',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full my-4',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Superscript,
      Subscript,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${
          isFullscreen ? 'min-h-[80vh]' : 'min-h-[400px]'
        } p-6`,
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.includes('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = () => {
              const url = reader.result as string;
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({ src: url })
                )
              );
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Autosave functionality
  useAutosave({
    data: value,
    onSave: onAutosave || (() => {}),
    enabled: autosave && !!onAutosave,
    delay: 3000,
  });

  // Toolbar action handlers
  const applyFormat = useCallback((command: string, value?: string) => {
    if (!editor) return;

    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'superscript':
        editor.chain().focus().toggleSuperscript().run();
        break;
      case 'subscript':
        editor.chain().focus().toggleSubscript().run();
        break;
      case 'highlight':
        editor.chain().focus().toggleHighlight().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'taskList':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'alignLeft':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'alignCenter':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'alignRight':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'alignJustify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      case 'undo':
        editor.chain().focus().undo().run();
        break;
      case 'redo':
        editor.chain().focus().redo().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'heading4':
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case 'heading5':
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      case 'heading6':
        editor.chain().focus().toggleHeading({ level: 6 }).run();
        break;
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'horizontalRule':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'insertTable':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
    }
  }, [editor]);

  const handleLinkInsertion = useCallback(() => {
    if (!editor || !linkUrl) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetMark('link').run();
    } else {
      editor.chain().focus().extendMarkRange('link').setMark('link', { href: linkUrl }).run();
    }
    
    setLinkUrl('');
    setLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  const handleImageUrlInsertion = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setImagePopoverOpen(false);
  }, [editor, imageUrl]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
    setImagePopoverOpen(false);
  }, [editor]);

  const handleVideoInsertion = useCallback(() => {
    if (!editor || !videoUrl) return;

    editor.commands.setYoutubeVideo({
      src: videoUrl,
    });
    setVideoUrl('');
    setVideoPopoverOpen(false);
  }, [editor, videoUrl]);

  const handleFontFamilyChange = useCallback((value: string) => {
    if (!editor) return;
    if (value === 'default') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(value).run();
    }
  }, [editor]);

  const handleFontSizeChange = useCallback((value: string) => {
    if (!editor) return;
    if (value === 'default') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(value).run();
    }
  }, [editor]);

  const handleColorChange = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setColorPopoverOpen(false);
  }, [editor]);

  const handleLineHeightChange = useCallback((height: string) => {
    if (!editor) return;
    // Apply line height to selected content
    const { from, to } = editor.state.selection;
    editor.chain().focus().setTextSelection({ from, to }).run();
    
    // Update CSS custom property for line height
    document.documentElement.style.setProperty('--editor-line-height', height);
    setLineHeightPopoverOpen(false);
  }, [editor]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case 'i':
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case 'u':
            event.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            break;
          case 'k':
            event.preventDefault();
            setLinkPopoverOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-md bg-white shadow-sm transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 max-w-none' : ''
    }`}>
      <EditorToolbar 
        applyFormat={applyFormat}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
        linkPopoverOpen={linkPopoverOpen}
        setLinkPopoverOpen={setLinkPopoverOpen}
        handleLinkInsertion={handleLinkInsertion}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        imagePopoverOpen={imagePopoverOpen}
        setImagePopoverOpen={setImagePopoverOpen}
        handleImageUrlInsertion={handleImageUrlInsertion}
        handleImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        videoPopoverOpen={videoPopoverOpen}
        setVideoPopoverOpen={setVideoPopoverOpen}
        handleVideoInsertion={handleVideoInsertion}
        fontOptionsOpen={fontOptionsOpen}
        setFontOptionsOpen={setFontOptionsOpen}
        colorPopoverOpen={colorPopoverOpen}
        setColorPopoverOpen={setColorPopoverOpen}
        lineHeightPopoverOpen={lineHeightPopoverOpen}
        setLineHeightPopoverOpen={setLineHeightPopoverOpen}
        handleFontFamilyChange={handleFontFamilyChange}
        handleFontSizeChange={handleFontSizeChange}
        handleColorChange={handleColorChange}
        handleLineHeightChange={handleLineHeightChange}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
      <EditorContent 
        editor={editor} 
        className={`transition-all duration-300 ${
          isFullscreen ? 'min-h-[calc(80vh-60px)]' : 'min-h-[400px]'
        }`}
      />
      
      {/* Enhanced Editor Styles */}
      <style>{`
        .ProseMirror {
          outline: none;
          font-size: 16px;
          line-height: var(--editor-line-height, 1.8);
          color: #333333;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, 
        .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
          line-height: 1.4;
          margin: 1em 0 0.5em 0;
          font-weight: 600;
        }
        .ProseMirror h1 { font-size: 2.25em; }
        .ProseMirror h2 { font-size: 1.875em; }
        .ProseMirror h3 { font-size: 1.5em; }
        .ProseMirror h4 { font-size: 1.25em; }
        .ProseMirror h5 { font-size: 1.125em; }
        .ProseMirror h6 { font-size: 1em; }
        .ProseMirror ul, .ProseMirror ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }
        .ProseMirror li {
          margin-bottom: 0.5em;
          line-height: 1.6;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
        }
        .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }
        .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        .ProseMirror blockquote {
          margin: 2em 0;
          padding: 1em 2em;
          border-left: 4px solid #e2e8f0;
          background-color: #f8fafc;
          font-style: italic;
        }
        .ProseMirror pre {
          margin: 1em 0;
          padding: 1em;
          background-color: #f1f5f9;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        .ProseMirror code {
          background-color: #f1f5f9;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
        .ProseMirror table {
          margin: 1em 0;
          border-collapse: collapse;
          width: 100%;
        }
        .ProseMirror table td, .ProseMirror table th {
          border: 1px solid #e2e8f0;
          padding: 0.5em 1em;
          min-width: 1em;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          background-color: #f8fafc;
          font-weight: 600;
        }
        .ProseMirror hr {
          margin: 2em 0;
          border: none;
          border-top: 2px solid #e2e8f0;
        }
        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0.1em 0.2em;
          border-radius: 0.25rem;
        }
        .ProseMirror sup {
          font-size: 0.75em;
          vertical-align: super;
        }
        .ProseMirror sub {
          font-size: 0.75em;
          vertical-align: sub;
        }
        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror .youtube-embed {
          margin: 1.5em 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        .ProseMirror img:hover {
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #8B5CF6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
