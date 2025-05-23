
import React, { useEffect, useRef } from 'react';
import { ckeditorConfig } from '@/config/ckeditorConfig';

declare global {
  interface Window {
    CKEDITOR: any;
  }
}

interface CKEditor4Props {
  value: string;
  onChange: (value: string) => void;
  config?: any;
}

const CKEditor4: React.FC<CKEditor4Props> = ({ value, onChange, config = {} }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const finalConfig = {
    ...ckeditorConfig,
    ...config
  };

  const loadCKEditor = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.CKEDITOR) {
        resolve();
        return;
      }

      // Load the latest version (4.25.1)
      const script = document.createElement('script');
      script.src = 'https://cdn.ckeditor.com/4.25.1/standard-all/ckeditor.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load CKEditor'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const initializeEditor = async () => {
      if (isInitializedRef.current || !editorRef.current) return;

      try {
        await loadCKEditor();
        
        if (window.CKEDITOR && editorRef.current) {
          editorInstanceRef.current = window.CKEDITOR.replace(editorRef.current, finalConfig);
          
          editorInstanceRef.current.on('instanceReady', () => {
            if (value && editorInstanceRef.current) {
              editorInstanceRef.current.setData(value);
            }
            isInitializedRef.current = true;
          });

          editorInstanceRef.current.on('change', () => {
            if (editorInstanceRef.current && onChange) {
              const data = editorInstanceRef.current.getData();
              onChange(data);
            }
          });

          // Also listen for key events to capture changes more frequently
          editorInstanceRef.current.on('key', () => {
            setTimeout(() => {
              if (editorInstanceRef.current && onChange) {
                const data = editorInstanceRef.current.getData();
                onChange(data);
              }
            }, 100);
          });

          // Listen for blur events to ensure changes are captured
          editorInstanceRef.current.on('blur', () => {
            if (editorInstanceRef.current && onChange) {
              const data = editorInstanceRef.current.getData();
              onChange(data);
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize CKEditor:', error);
      }
    };

    initializeEditor();

    return () => {
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
          isInitializedRef.current = false;
        } catch (error) {
          console.error('Error destroying CKEditor instance:', error);
        }
      }
    };
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorInstanceRef.current && isInitializedRef.current) {
      const currentData = editorInstanceRef.current.getData();
      if (value !== currentData) {
        editorInstanceRef.current.setData(value || '');
      }
    }
  }, [value]);

  return (
    <div className="ckeditor-wrapper">
      <textarea
        ref={editorRef}
        style={{ display: 'none' }}
        defaultValue={value}
      />
    </div>
  );
};

export default CKEditor4;
