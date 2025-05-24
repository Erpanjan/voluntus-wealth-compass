
import EditorJS, { OutputData } from '@editorjs/editorjs';

// Convert HTML to Editor.js JSON format
export const htmlToEditorJS = (html: string): OutputData => {
  if (!html || html.trim() === '') {
    return {
      time: Date.now(),
      blocks: [],
      version: "2.28.2"
    };
  }

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const blocks: any[] = [];
  
  // Convert different HTML elements to Editor.js blocks
  const elements = tempDiv.children;
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    switch (element.tagName.toLowerCase()) {
      case 'h1':
        blocks.push({
          type: 'header',
          data: {
            text: element.textContent || '',
            level: 1
          }
        });
        break;
      case 'h2':
        blocks.push({
          type: 'header',
          data: {
            text: element.textContent || '',
            level: 2
          }
        });
        break;
      case 'h3':
        blocks.push({
          type: 'header',
          data: {
            text: element.textContent || '',
            level: 3
          }
        });
        break;
      case 'p':
        if (element.textContent?.trim()) {
          blocks.push({
            type: 'paragraph',
            data: {
              text: element.innerHTML
            }
          });
        }
        break;
      case 'ul':
        const ulItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent || '');
        if (ulItems.length > 0) {
          blocks.push({
            type: 'list',
            data: {
              style: 'unordered',
              items: ulItems
            }
          });
        }
        break;
      case 'ol':
        const olItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent || '');
        if (olItems.length > 0) {
          blocks.push({
            type: 'list',
            data: {
              style: 'ordered',
              items: olItems
            }
          });
        }
        break;
      case 'img':
        const imgSrc = element.getAttribute('src');
        if (imgSrc) {
          blocks.push({
            type: 'image',
            data: {
              file: {
                url: imgSrc
              },
              caption: element.getAttribute('alt') || '',
              withBorder: false,
              withBackground: false,
              stretched: false
            }
          });
        }
        break;
      case 'blockquote':
        blocks.push({
          type: 'quote',
          data: {
            text: element.textContent || '',
            caption: '',
            alignment: 'left'
          }
        });
        break;
      case 'pre':
        blocks.push({
          type: 'code',
          data: {
            code: element.textContent || ''
          }
        });
        break;
      default:
        // For any other elements, treat as paragraph
        if (element.textContent?.trim()) {
          blocks.push({
            type: 'paragraph',
            data: {
              text: element.innerHTML
            }
          });
        }
        break;
    }
  }

  // If no blocks were created and we have text content, create a paragraph
  if (blocks.length === 0 && tempDiv.textContent?.trim()) {
    blocks.push({
      type: 'paragraph',
      data: {
        text: tempDiv.innerHTML
      }
    });
  }

  return {
    time: Date.now(),
    blocks,
    version: "2.28.2"
  };
};

// Convert Editor.js JSON format to HTML
export const editorJSToHtml = (data: OutputData): string => {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return '';
  }

  const htmlBlocks = data.blocks.map(block => {
    switch (block.type) {
      case 'header':
        const level = block.data.level || 1;
        return `<h${level}>${block.data.text}</h${level}>`;
      
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items.map((item: string) => `<li>${item}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      
      case 'image':
        const src = block.data.file?.url || block.data.url;
        const caption = block.data.caption || '';
        return `<img src="${src}" alt="${caption}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px;" />`;
      
      case 'quote':
        return `<blockquote>${block.data.text}</blockquote>`;
      
      case 'code':
        return `<pre><code>${block.data.code}</code></pre>`;
      
      case 'delimiter':
        return '<hr>';
      
      case 'table':
        if (block.data.content && Array.isArray(block.data.content)) {
          const rows = block.data.content.map((row: string[]) => {
            const cells = row.map(cell => `<td>${cell}</td>`).join('');
            return `<tr>${cells}</tr>`;
          }).join('');
          return `<table><tbody>${rows}</tbody></table>`;
        }
        return '';
      
      case 'embed':
        return block.data.embed || '';
      
      case 'raw':
        return block.data.html || '';
      
      default:
        return `<p>${block.data.text || ''}</p>`;
    }
  });

  return htmlBlocks.join('\n');
};
