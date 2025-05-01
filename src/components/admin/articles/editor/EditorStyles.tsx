
import React from 'react';

const EditorStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* Editor content styling */
      .rich-text-editor .content {
        min-height: 300px;
        padding: 1rem;
        font-family: 'Poppins', sans-serif;
      }

      .rich-text-editor .content:focus {
        outline: none;
      }

      /* Typography */
      .rich-text-editor .content h1 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        line-height: 1.2;
      }

      .rich-text-editor .content h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        line-height: 1.2;
      }

      .rich-text-editor .content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        line-height: 1.2;
      }

      .rich-text-editor .content p {
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      /* Lists styling */
      .rich-text-editor .content ul {
        list-style-type: disc;
        margin-left: 1.5rem;
        margin-bottom: 1rem;
      }

      .rich-text-editor .content ol {
        list-style-type: decimal;
        margin-left: 1.5rem;
        margin-bottom: 1rem;
      }

      .rich-text-editor .content li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
      }

      .rich-text-editor .content ul ul,
      .rich-text-editor .content ol ul {
        list-style-type: circle;
        margin-top: 0.5rem;
      }

      .rich-text-editor .content ul ol,
      .rich-text-editor .content ol ol {
        list-style-type: lower-alpha;
        margin-top: 0.5rem;
      }

      /* Links */
      .rich-text-editor .content a {
        color: #8B5CF6;
        text-decoration: underline;
      }

      /* Table styling */
      .rich-text-editor .content table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }

      .rich-text-editor .content th,
      .rich-text-editor .content td {
        border: 1px solid #ddd;
        padding: 0.5rem;
      }

      .rich-text-editor .content th {
        background-color: #f2f2f2;
        font-weight: 600;
      }

      /* Image styling */
      .rich-text-editor .content img {
        max-width: 100%;
        height: auto;
        margin: 1rem 0;
      }

      /* Blockquote */
      .rich-text-editor .content blockquote {
        border-left: 4px solid #8B5CF6;
        margin-left: 0;
        margin-right: 0;
        padding-left: 1rem;
        color: #666;
        font-style: italic;
        margin-bottom: 1rem;
      }

      /* Code blocks */
      .rich-text-editor .content pre {
        background-color: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 1rem;
      }

      .rich-text-editor .content code {
        font-family: monospace;
      }
      
      /* Reset any browser default margins that might interfere */
      .rich-text-editor .content ul,
      .rich-text-editor .content ol {
        padding-left: 2em;
        margin-top: 0.5em;
        margin-bottom: 1em;
      }
      
      /* Ensure proper indentation for nested lists */
      .rich-text-editor .content li > ul,
      .rich-text-editor .content li > ol {
        margin-top: 0.25em;
        margin-bottom: 0.5em;
      }
    `}} />
  );
};

export default EditorStyles;
