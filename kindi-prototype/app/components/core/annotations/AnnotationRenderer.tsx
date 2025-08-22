"use client";

import React from 'react';
import { Annotation } from '@/app/models/annotation-types';

interface AnnotationRendererProps {
  annotation: Annotation;
}

const AnnotationRenderer: React.FC<AnnotationRendererProps> = ({
  annotation
}) => {
  // Simple markdown renderer
  const renderMarkdown = (markdown: string) => {
    // This is a very basic markdown renderer
    // In a real app, you would use a library like marked or remark
    
    const html = markdown
      // Headers
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold my-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold my-2">$2</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-md font-bold my-2">$3</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
  };
  
  // Render based on format
  switch (annotation.format) {
    case 'markdown':
      return (
        <div className="markdown-content prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(annotation.content) }} />
        </div>
      );
    case 'html':
      return (
        <div
          className="html-content"
          dangerouslySetInnerHTML={{ __html: annotation.content }}
        />
      );
    case 'plain':
    default:
      return (
        <div className="plain-content">
          {annotation.content.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ))}
        </div>
      );
  }
};

export default AnnotationRenderer;
