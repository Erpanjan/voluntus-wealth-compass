
import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Raw from '@editorjs/raw';
import Embed from '@editorjs/embed';
import { htmlToEditorJS, editorJSToHtml } from '@/utils/editorjsUtils';

interface EditorJSComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const EditorJSComponent: React.FC<EditorJSComponentProps> = ({ value, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!holderRef.current) return;

    // Initialize Editor.js
    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: '/api/uploadFile',
              byUrl: '/api/fetchUrl',
            }
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/fetchUrl',
          }
        },
        code: Code,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        delimiter: Delimiter,
        raw: Raw,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        }
      },
      data: htmlToEditorJS(value),
      onReady: () => {
        setIsReady(true);
        console.log('Editor.js is ready to work!');
      },
      onChange: async (api, event) => {
        try {
          const outputData = await api.saver.save();
          const htmlContent = editorJSToHtml(outputData);
          onChange(htmlContent);
        } catch (error) {
          console.error('Error saving Editor.js content:', error);
        }
      },
      placeholder: 'Start writing your article content...',
      autofocus: true,
      hideToolbar: false,
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (isReady && editorRef.current && value !== undefined) {
      const editorData = htmlToEditorJS(value);
      editorRef.current.render(editorData).catch(console.error);
    }
  }, [value, isReady]);

  return (
    <div className="editorjs-container border rounded-md bg-white shadow-sm">
      <div 
        ref={holderRef} 
        className="min-h-[400px] p-6"
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#333333'
        }}
      />
      <style>{`
        .codex-editor__redactor {
          padding-bottom: 0 !important;
        }
        .ce-block__content,
        .ce-toolbar__content {
          max-width: none !important;
        }
        .ce-paragraph {
          line-height: 1.8 !important;
        }
        .ce-header {
          line-height: 1.4 !important;
          margin: 1em 0 0.5em 0 !important;
        }
        .ce-list {
          margin: 1em 0 !important;
        }
        .ce-list__item {
          margin-bottom: 0.5em !important;
          line-height: 1.6 !important;
        }
        .ce-quote {
          margin: 2em 0 !important;
          padding: 1em 2em !important;
          border-left: 4px solid #e2e8f0 !important;
          background-color: #f8fafc !important;
        }
        .ce-code {
          margin: 1em 0 !important;
        }
        .ce-table {
          margin: 1em 0 !important;
        }
        .ce-image {
          margin: 1.5em 0 !important;
        }
        .ce-delimiter {
          margin: 2em 0 !important;
        }
      `}</style>
    </div>
  );
};

export default EditorJSComponent;
