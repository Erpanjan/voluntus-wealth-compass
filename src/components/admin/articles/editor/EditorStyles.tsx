
import React from 'react';

const EditorStyles: React.FC = () => {
  return (
    <style>
      {`
        .rich-text-editor img {
          cursor: pointer;
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1rem 0;
        }
        .rich-text-editor img:hover {
          box-shadow: 0 0 0 2px #8B5CF6;
        }
        .rich-text-editor .image-context-menu div:hover {
          background-color: #f3f4f6;
        }
      `}
    </style>
  );
};

export default EditorStyles;
