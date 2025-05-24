
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

const lowlight = createLowlight(common);

export const getEditorExtensions = () => [
  StarterKit.configure({
    codeBlock: false, // We'll use CodeBlockLowlight instead
  }),
  Image.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg cursor-pointer select-none',
      style: 'resize: both; overflow: auto;',
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
];
