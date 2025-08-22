"use client";

import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize editor
    if (editorRef.current) {
      // For simplicity, we'll use a basic contentEditable approach
      const editor = editorRef.current;
      
      // Only update the HTML if it's different from the current value
      // This prevents losing cursor position when typing
      if (editor.innerHTML !== value) {
        editor.innerHTML = value;
      }
      
      const handleInput = () => {
        onChange(editor.innerHTML);
      };
      
      editor.addEventListener('input', handleInput);
      
      return () => {
        editor.removeEventListener('input', handleInput);
      };
    }
  }, [value, onChange]);
  
  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  return (
    <div className="rich-text-editor border rounded overflow-hidden">
      <div className="editor-toolbar flex flex-wrap gap-1 p-2 bg-gray-100 border-b">
        <button
          type="button"
          onClick={() => applyFormatting('bold')}
          className="toolbar-button p-1 rounded hover:bg-gray-200"
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H7V7h4a2.5 2.5 0 012.5 2.5v.5zm-2.5 5H7v-5h4a2.5 2.5 0 012.5 2.5v.5a2.5 2.5 0 01-2.5 2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('italic')}
          className="toolbar-button p-1 rounded hover:bg-gray-200"
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 10a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm-5-5a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('underline')}
          className="toolbar-button p-1 rounded hover:bg-gray-200"
          title="Underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 14a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm2-7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
          </svg>
        </button>
        <span className="border-r h-6 mx-1"></span>
        <button
          type="button"
          onClick={() => applyFormatting('insertUnorderedList')}
          className="toolbar-button p-1 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('insertOrderedList')}
          className="toolbar-button p-1 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="border-r h-6 mx-1"></span>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) {
              applyFormatting('createLink', url);
            }
          }}
          className="toolbar-button p-1 rounded hover:bg-gray-200"
          title="Insert Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div
        ref={editorRef}
        className="editor-content p-3 min-h-[120px] focus:outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

export default RichTextEditor;
