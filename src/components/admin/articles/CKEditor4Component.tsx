
import React, { useEffect, useRef, useCallback } from 'react';

interface CKEditor4ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

declare global {
  interface Window {
    CKEDITOR: any;
  }
}

const CKEditor4Component: React.FC<CKEditor4ComponentProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);

  const initializeEditor = useCallback(() => {
    if (!window.CKEDITOR || !editorRef.current) return;

    // Destroy existing instance if it exists
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy();
      editorInstanceRef.current = null;
    }

    // Configure CKEditor
    const config = {
      toolbar: [
        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
        { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
        '/',
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule'] },
        '/',
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
      ],
      height: 400,
      resize_enabled: true,
      removeButtons: '',
      extraPlugins: 'font,colorbutton,justify',
      font_names: 'Poppins/Poppins, sans-serif;' + 
                  'Arial/Arial, Helvetica, sans-serif;' +
                  'Times New Roman/Times New Roman, Times, serif;' +
                  'Courier New/Courier New, Courier, monospace;' +
                  'Georgia/Georgia, serif;' +
                  'Verdana/Verdana, Geneva, sans-serif;' +
                  'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
                  'Tahoma/Tahoma, Geneva, sans-serif;' +
                  'Impact/Impact, Charcoal, sans-serif;' +
                  'Comic Sans MS/Comic Sans MS, cursive',
      font_defaultLabel: 'Poppins',
      fontSize_defaultLabel: '16px',
      format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address;div',
      stylesSet: [
        { name: 'Normal', element: 'p' },
        { name: 'Heading 1', element: 'h1' },
        { name: 'Heading 2', element: 'h2' },
        { name: 'Heading 3', element: 'h3' },
        { name: 'Heading 4', element: 'h4' },
        { name: 'Code', element: 'code' },
        { name: 'Quote', element: 'blockquote' }
      ]
    };

    // Create editor instance
    editorInstanceRef.current = window.CKEDITOR.replace(editorRef.current, config);

    // Set initial data
    editorInstanceRef.current.on('instanceReady', () => {
      if (value && !isUpdatingRef.current) {
        editorInstanceRef.current.setData(value);
      }
    });

    // Listen for content changes
    editorInstanceRef.current.on('change', () => {
      if (!isUpdatingRef.current) {
        const data = editorInstanceRef.current.getData();
        onChange(data);
      }
    });

    // Also listen for key events for real-time updates
    editorInstanceRef.current.on('key', () => {
      setTimeout(() => {
        if (!isUpdatingRef.current) {
          const data = editorInstanceRef.current.getData();
          onChange(data);
        }
      }, 100);
    });

  }, [onChange, value]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorInstanceRef.current && value !== editorInstanceRef.current.getData()) {
      isUpdatingRef.current = true;
      editorInstanceRef.current.setData(value);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [value]);

  // Initialize editor when CKEditor is available
  useEffect(() => {
    if (window.CKEDITOR) {
      initializeEditor();
    } else {
      // Wait for CKEditor to load
      const checkCKEditor = setInterval(() => {
        if (window.CKEDITOR) {
          clearInterval(checkCKEditor);
          initializeEditor();
        }
      }, 100);

      return () => clearInterval(checkCKEditor);
    }

    // Cleanup on unmount
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [initializeEditor]);

  return (
    <div className="ckeditor-wrapper">
      <textarea
        ref={editorRef}
        defaultValue={value}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CKEditor4Component;
