
import React from 'react';

const EditorStylesComponent: React.FC = () => (
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
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s ease;
    }
    .ProseMirror img:hover {
      border-color: #8B5CF6;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
    }
    .ProseMirror img.ProseMirror-selectednode {
      outline: 2px solid #8B5CF6;
      outline-offset: 2px;
    }
  `}</style>
);

export default EditorStylesComponent;
