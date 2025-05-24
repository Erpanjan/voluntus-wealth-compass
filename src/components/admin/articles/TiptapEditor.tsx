
import React, { useCallback } from 'react';
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
import TiptapToolbar from './TiptapToolbar';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Color,
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:');
    if (url && editor) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md bg-white shadow-sm">
      <TiptapToolbar 
        editor={editor} 
        addImage={addImage}
        addYoutube={addYoutube}
      />
      <EditorContent 
        editor={editor} 
        className="min-h-[400px]"
      />
      <style>{`
        .ProseMirror {
          outline: none;
          font-size: 16px;
          line-height: 1.8;
          color: #333333;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          line-height: 1.4;
          margin: 1em 0 0.5em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          margin: 1em 0;
        }
        .ProseMirror li {
          margin-bottom: 0.5em;
          line-height: 1.6;
        }
        .ProseMirror blockquote {
          margin: 2em 0;
          padding: 1em 2em;
          border-left: 4px solid #e2e8f0;
          background-color: #f8fafc;
        }
        .ProseMirror pre {
          margin: 1em 0;
          padding: 1em;
          background-color: #f1f5f9;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .ProseMirror table {
          margin: 1em 0;
          border-collapse: collapse;
          width: 100%;
        }
        .ProseMirror table td, .ProseMirror table th {
          border: 1px solid #e2e8f0;
          padding: 0.5em 1em;
        }
        .ProseMirror table th {
          background-color: #f8fafc;
          font-weight: 600;
        }
        .ProseMirror img {
          margin: 1.5em 0;
          border-radius: 0.5rem;
        }
        .ProseMirror hr {
          margin: 2em 0;
          border: none;
          border-top: 2px solid #e2e8f0;
        }
        .ProseMirror .youtube-embed {
          margin: 1.5em 0;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
