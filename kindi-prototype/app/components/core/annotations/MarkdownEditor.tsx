"use client";

import React, { useState } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange
}) => {
  const [isPreview, setIsPreview] = useState(false);
  
  const insertMarkdown = (markdownSymbol: string, placeholder: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText;
    if (selectedText) {
      // If text is selected, wrap it with markdown
      newText = textarea.value.substring(0, start) + 
                markdownSymbol + selectedText + markdownSymbol +
                textarea.value.substring(end);
    } else {
      // If no text is selected, insert markdown with placeholder
      newText = textarea.value.substring(0, start) + 
                markdownSymbol + placeholder + markdownSymbol +
                textarea.value.substring(end);
    }
    
    onChange(newText);
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(
          start + markdownSymbol.length,
          end + markdownSymbol.length
        );
      } else {
        const cursorPos = start + markdownSymbol.length;
        textarea.setSelectionRange(
          cursorPos,
          cursorPos + placeholder.length
        );
      }
    }, 0);
  };
  
  const insertList = (ordered: boolean) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const prefix = ordered ? '1. ' : '- ';
    
    const newText = textarea.value.substring(0, start) + 
                    prefix + 'List item' +
                    textarea.value.substring(start);
    
    onChange(newText);
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length;
      textarea.setSelectionRange(cursorPos, cursorPos + 9); // Select "List item"
    }, 0);
  };
  
  const insertLink = () => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText;
    if (selectedText) {
      newText = textarea.value.substring(0, start) + 
                `[${selectedText}](url)` +
                textarea.value.substring(end);
    } else {
      newText = textarea.value.substring(0, start) + 
                '[Link text](url)' +
                textarea.value.substring(end);
    }
    
    onChange(newText);
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        const linkStart = start + selectedText.length + 3;
        textarea.setSelectionRange(linkStart, linkStart + 3); // Select "url"
      } else {
        textarea.setSelectionRange(start + 1, start + 10); // Select "Link text"
      }
    }, 0);
  };
  
  // Simple markdown preview renderer
  const renderMarkdown = (markdown: string) => {
    // This is a very basic markdown renderer
    // In a real app, you would use a library like marked or remark
    
    const html = markdown
      // Headers
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
  };
  
  return (
    <div className="markdown-editor border rounded overflow-hidden">
      <div className="editor-toolbar flex flex-wrap gap-1 p-2 bg-gray-100 border-b">
        <div className="flex-grow flex gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown('**', 'bold text')}
            className="toolbar-button p-1 rounded hover:bg-gray-200"
            title="Bold"
            disabled={isPreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H7V7h4a2.5 2.5 0 012.5 2.5v.5zm-2.5 5H7v-5h4a2.5 2.5 0 012.5 2.5v.5a2.5 2.5 0 01-2.5 2z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', 'italic text')}
            className="toolbar-button p-1 rounded hover:bg-gray-200"
            title="Italic"
            disabled={isPreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 10a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm-5-5a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5z" />
            </svg>
          </button>
          <span className="border-r h-6 mx-1"></span>
          <button
            type="button"
            onClick={() => insertList(false)}
            className="toolbar-button p-1 rounded hover:bg-gray-200"
            title="Bullet List"
            disabled={isPreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertList(true)}
            className="toolbar-button p-1 rounded hover:bg-gray-200"
            title="Numbered List"
            disabled={isPreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="border-r h-6 mx-1"></span>
          <button
            type="button"
            onClick={insertLink}
            className="toolbar-button p-1 rounded hover:bg-gray-200"
            title="Insert Link"
            disabled={isPreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-2 py-1 rounded text-xs ${
            isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      
      {isPreview ? (
        <div 
          className="markdown-preview p-3 min-h-[120px]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      ) : (
        <textarea
          id="markdown-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 min-h-[120px] focus:outline-none"
          placeholder="Write your markdown here..."
        />
      )}
    </div>
  );
};

export default MarkdownEditor;
