
import React, { useEffect, useRef } from 'react';

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
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const isInitialized = useRef(false);
  const [editorReady, setEditorReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [useFallback, setUseFallback] = React.useState(false);

  useEffect(() => {
    const initializeEditor = async () => {
      if (!editorRef.current || isInitialized.current) return;

      console.log('TrumbowygEditor: Starting initialization...');

      try {
        // Step 1: Load jQuery
        console.log('TrumbowygEditor: Loading jQuery...');
        let $: any;
        
        try {
          // Try ES6 import first (works better with Vite)
          const jqueryModule = await import('jquery');
          $ = jqueryModule.default || jqueryModule;
          console.log('TrumbowygEditor: jQuery loaded via ES6 import', !!$);
        } catch (importError) {
          console.log('TrumbowygEditor: ES6 import failed, trying require:', importError);
          try {
            $ = require('jquery');
            console.log('TrumbowygEditor: jQuery loaded via require', !!$);
          } catch (requireError) {
            console.error('TrumbowygEditor: Both import methods failed:', { importError, requireError });
            throw new Error('Failed to load jQuery - both import and require failed');
          }
        }

        if (!$ || typeof $ !== 'function') {
          throw new Error('jQuery loaded but is not a function');
        }

        // Step 2: Load Trumbowyg CSS first
        console.log('TrumbowygEditor: Loading Trumbowyg CSS...');
        await import('trumbowyg/dist/ui/trumbowyg.min.css');
        console.log('TrumbowygEditor: Trumbowyg CSS loaded');
        
        // Step 3: Load Trumbowyg JS
        console.log('TrumbowygEditor: Loading Trumbowyg JS...');
        await import('trumbowyg/dist/trumbowyg.min.js');
        console.log('TrumbowygEditor: Trumbowyg JS loaded');

        // Step 4: Load plugins progressively (don't fail if one plugin fails)
        const plugins = [
          { name: 'colors', js: 'trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js', css: 'trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css' },
          { name: 'table', js: 'trumbowyg/dist/plugins/table/trumbowyg.table.min.js', css: 'trumbowyg/dist/plugins/table/ui/trumbowyg.table.min.css' },
          { name: 'history', js: 'trumbowyg/dist/plugins/history/trumbowyg.history.min.js' },
          { name: 'fontfamily', js: 'trumbowyg/dist/plugins/fontfamily/trumbowyg.fontfamily.min.js' },
          { name: 'fontsize', js: 'trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize.min.js' }
        ];

        const loadedPlugins: string[] = [];
        
        for (const plugin of plugins) {
          try {
            console.log(`TrumbowygEditor: Loading plugin ${plugin.name}...`);
            if (plugin.css) {
              await import(plugin.css);
            }
            await import(plugin.js);
            loadedPlugins.push(plugin.name);
            console.log(`TrumbowygEditor: Plugin ${plugin.name} loaded successfully`);
          } catch (pluginError) {
            console.warn(`TrumbowygEditor: Failed to load plugin ${plugin.name}:`, pluginError);
            // Continue loading other plugins
          }
        }

        console.log('TrumbowygEditor: Loaded plugins:', loadedPlugins);

        // Step 5: Initialize the editor
        console.log('TrumbowygEditor: Initializing editor...');
        const $editor = $(editorRef.current);
        
        // Build button configuration based on loaded plugins
        const btns = [
          ['viewHTML'],
          ['undo', 'redo'],
          ['formatting']
        ];

        if (loadedPlugins.includes('fontfamily')) {
          btns.push(['fontfamily']);
        }
        if (loadedPlugins.includes('fontsize')) {
          btns.push(['fontsize']);
        }
        if (loadedPlugins.includes('colors')) {
          btns.push(['foreColor', 'backColor']);
        }

        btns.push(
          ['strong', 'em', 'del'],
          ['link'],
          ['insertImage'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
          ['unorderedList', 'orderedList']
        );

        if (loadedPlugins.includes('table')) {
          btns.push(['table']);
        }

        btns.push(
          ['removeformat'],
          ['fullscreen']
        );

        // Initialize with available plugins only
        const trumbowygConfig: any = {
          btns,
          autogrow: true,
          removeformatPasted: true,
          semantic: true,
          resetCss: true,
          tagsToRemove: ['script', 'link'],
          tagsToKeep: ['hr', 'img', 'embed', 'iframe'],
          urlProtocol: true,
          plugins: {}
        };

        // Add plugin configurations only if plugins are loaded
        if (loadedPlugins.includes('colors')) {
          trumbowygConfig.plugins.colors = {
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
          };
        }

        if (loadedPlugins.includes('fontfamily')) {
          trumbowygConfig.plugins.fontfamily = {
            fontList: [
              { name: 'Poppins', family: 'Poppins, sans-serif' },
              { name: 'Arial', family: 'Arial, sans-serif' },
              { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
              { name: 'Times New Roman', family: 'Times New Roman, serif' },
              { name: 'Georgia', family: 'Georgia, serif' },
              { name: 'Courier New', family: 'Courier New, monospace' }
            ]
          };
        }

        if (loadedPlugins.includes('fontsize')) {
          trumbowygConfig.plugins.fontsize = {
            sizeList: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
          };
        }

        console.log('TrumbowygEditor: Applying configuration...', trumbowygConfig);
        $editor.trumbowyg(trumbowygConfig);

        // Set initial content
        if (value) {
          console.log('TrumbowygEditor: Setting initial content...');
          $editor.trumbowyg('html', value);
        }

        // Listen for content changes
        $editor.on('tbwchange', () => {
          const newContent = String($editor.trumbowyg('html'));
          console.log('TrumbowygEditor: Content changed');
          onChange(newContent);
        });

        // Make jQuery available globally for updates
        (window as any).$ = $;

        isInitialized.current = true;
        setEditorReady(true);
        setError(null);
        console.log('TrumbowygEditor: Initialization complete!');

        // Cleanup function
        return () => {
          if (isInitialized.current) {
            try {
              console.log('TrumbowygEditor: Cleaning up...');
              $editor.trumbowyg('destroy');
              isInitialized.current = false;
            } catch (error) {
              console.warn('TrumbowygEditor: Error during cleanup:', error);
            }
          }
        };
      } catch (error) {
        console.error('TrumbowygEditor: Critical error during initialization:', error);
        setError(`Editor initialization failed: ${error.message}`);
        setUseFallback(true);
      }
    };

    const timeoutId = setTimeout(() => {
      console.log('TrumbowygEditor: Initialization timeout, switching to fallback');
      if (!editorReady && !error) {
        setError('Editor loading timed out');
        setUseFallback(true);
      }
    }, 10000); // 10 second timeout

    initializeEditor().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (useFallback && fallbackRef.current) {
      // Update fallback textarea
      if (fallbackRef.current.value !== value) {
        fallbackRef.current.value = value;
      }
    } else if (editorRef.current && isInitialized.current && value !== undefined) {
      try {
        const $ = (window as any).$;
        if ($) {
          const $editor = $(editorRef.current);
          const currentContent = String($editor.trumbowyg('html'));
          if (currentContent !== value) {
            $editor.trumbowyg('html', value);
          }
        }
      } catch (error) {
        console.warn('TrumbowygEditor: Error updating content:', error);
      }
    }
  }, [value, useFallback]);

  // Handle fallback textarea changes
  const handleFallbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Show error state with fallback option
  if (error) {
    return (
      <div className="space-y-4">
        <div className="border rounded-md p-4 bg-amber-50 text-amber-800 border-amber-200">
          <h3 className="font-medium mb-2">Rich Text Editor Issue</h3>
          <p className="text-sm mb-3">{error}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => setUseFallback(true)} 
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Use Simple Editor
            </button>
          </div>
        </div>
        
        {useFallback && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Article Content (Simple Text Editor)
            </label>
            <textarea
              ref={fallbackRef}
              value={value}
              onChange={handleFallbackChange}
              className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['Poppins'] text-base leading-relaxed"
              placeholder="Start writing your article content..."
            />
            <p className="text-xs text-gray-500">
              Using fallback text editor. You can still format your content using HTML tags if needed.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Show loading state while editor initializes
  if (!editorReady && !useFallback) {
    return (
      <div className="border rounded-md p-6 bg-blue-50 text-blue-700">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm">Loading rich text editor...</p>
        </div>
        <p className="text-xs mt-2 text-blue-600">
          This should take just a few seconds. Check the browser console for detailed progress.
        </p>
      </div>
    );
  }

  // Show fallback editor if requested
  if (useFallback) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Article Content (Simple Text Editor)
        </label>
        <textarea
          ref={fallbackRef}
          value={value}
          onChange={handleFallbackChange}
          className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['Poppins'] text-base leading-relaxed"
          placeholder="Start writing your article content..."
        />
        <p className="text-xs text-gray-500">
          Using fallback text editor. You can format your content using HTML tags if needed.
        </p>
      </div>
    );
  }

  // Show the rich text editor
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
