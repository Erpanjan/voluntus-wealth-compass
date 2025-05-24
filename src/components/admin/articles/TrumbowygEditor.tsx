
import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

// Import Trumbowyg and its plugins
import 'trumbowyg/dist/ui/trumbowyg.min.css';
import 'trumbowyg/dist/trumbowyg.min.js';

// Import essential plugins only to reduce bundle size
import 'trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js';
import 'trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css';
import 'trumbowyg/dist/plugins/table/trumbowyg.table.min.js';
import 'trumbowyg/dist/plugins/table/ui/trumbowyg.table.min.css';
import 'trumbowyg/dist/plugins/history/trumbowyg.history.min.js';
import 'trumbowyg/dist/plugins/fontfamily/trumbowyg.fontfamily.min.js';
import 'trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize.min.js';

// Extend jQuery type to include trumbowyg method
declare global {
  interface JQuery {
    trumbowyg(options?: any): JQuery;
    trumbowyg(command: string, value?: any): JQuery | string;
  }
}

interface TrumbowygEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TrumbowygEditor: React.FC<TrumbowygEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isInitialized.current) return;

    const $editor = $(editorRef.current);
    
    // Initialize Trumbowyg with essential plugins
    $editor.trumbowyg({
      btns: [
        ['viewHTML'],
        ['undo', 'redo'],
        ['formatting'],
        ['fontfamily'],
        ['fontsize'],
        ['foreColor', 'backColor'],
        ['strong', 'em', 'del'],
        ['link'],
        ['insertImage'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['table'],
        ['removeformat'],
        ['fullscreen']
      ],
      plugins: {
        colors: {
          foreColorList: [
            '#333333', '#666666', '#999999', '#000000',
            '#ff0000', '#00ff00', '#0000ff', '#ffff00',
            '#ff00ff', '#00ffff', '#ffffff'
          ],
          backColorList: [
            '#ffffff', '#f2f2f2', '#e6e6e6', '#cccccc',
            '#ffebee', '#e8f5e8', '#e3f2fd', '#fffde7',
            '#fce4ec', '#e0f2f1'
          ]
        },
        fontfamily: {
          fontList: [
            { name: 'Poppins', family: 'Poppins, sans-serif' },
            { name: 'Arial', family: 'Arial, sans-serif' },
            { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
            { name: 'Times New Roman', family: 'Times New Roman, serif' },
            { name: 'Georgia', family: 'Georgia, serif' },
            { name: 'Courier New', family: 'Courier New, monospace' }
          ]
        },
        fontsize: {
          sizeList: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
        }
      },
      autogrow: true,
      removeformatPasted: true,
      semantic: true,
      resetCss: true,
      tagsToRemove: ['script', 'link'],
      tagsToKeep: ['hr', 'img', 'embed', 'iframe'],
      urlProtocol: true
    });

    // Set initial content
    if (value) {
      $editor.trumbowyg('html', value);
    }

    // Listen for content changes
    $editor.on('tbwchange', () => {
      const newContent = String($editor.trumbowyg('html'));
      onChange(newContent);
    });

    isInitialized.current = true;

    // Cleanup function
    return () => {
      if (isInitialized.current) {
        try {
          $editor.trumbowyg('destroy');
          isInitialized.current = false;
        } catch (error) {
          console.warn('Error destroying Trumbowyg:', error);
        }
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (editorRef.current && isInitialized.current && value !== undefined) {
      const $editor = $(editorRef.current);
      const currentContent = String($editor.trumbowyg('html'));
      if (currentContent !== value) {
        $editor.trumbowyg('html', value);
      }
    }
  }, [value]);

  return (
    <div className="trumbowyg-editor border rounded-md overflow-hidden bg-white shadow-sm">
      <style dangerouslySetInnerHTML={{
        __html: `
          .trumbowyg-box {
            border: none !important;
            background: white !important;
          }
          
          .trumbowyg-button-pane {
            background: #F6F6F7 !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 12px !important;
            border-radius: 0 !important;
          }
          
          .trumbowyg-button-group {
            margin-right: 8px !important;
          }
          
          .trumbowyg-button-group:last-child {
            margin-right: 0 !important;
          }
          
          .trumbowyg-editor {
            padding: 24px !important;
            min-height: 400px !important;
            font-family: 'Poppins', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.8 !important;
            color: #333333 !important;
            border: none !important;
            outline: none !important;
          }
          
          .trumbowyg-editor:empty:before {
            content: 'Start writing your article content...' !important;
            color: #9ca3af !important;
            font-style: italic !important;
          }
          
          .trumbowyg-button {
            background: white !important;
            border: 1px solid #d1d5db !important;
            border-radius: 4px !important;
            margin: 2px !important;
            padding: 6px 8px !important;
            font-size: 12px !important;
            color: #374151 !important;
            transition: all 0.2s !important;
          }
          
          .trumbowyg-button:hover {
            background: #f9fafb !important;
            border-color: #9ca3af !important;
          }
          
          .trumbowyg-button.trumbowyg-active {
            background: #e5e7eb !important;
            border-color: #6b7280 !important;
          }
          
          .trumbowyg-modal-box {
            border-radius: 8px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .trumbowyg-dropdown {
            border-radius: 4px !important;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
          }
        `
      }} />
      
      <textarea
        ref={editorRef}
        style={{ display: 'none' }}
        defaultValue={value}
      />
    </div>
  );
};

export default TrumbowygEditor;
