"use client";

import { Annotation } from '@/app/models/annotation-types';

// Import markdown parser (we'll need to install this)
let ReactMarkdown: any;

// Dynamic import for client-side only
if (typeof window !== 'undefined') {
  import('react-markdown').then(module => {
    ReactMarkdown = module.default;
  });
}

interface AnnotationRendererProps {
  annotation: Annotation;
}

const AnnotationRenderer: React.FC<AnnotationRendererProps> = ({
  annotation
}) => {
  // Render based on format
  switch (annotation.format) {
    case 'markdown':
      // If ReactMarkdown is not loaded yet, show plain text
      if (!ReactMarkdown) {
        return (
          <div className="markdown-content whitespace-pre-wrap">
            {annotation.content}
          </div>
        );
      }
      
      return (
        <div className="markdown-content prose dark:prose-invert max-w-none">
          <ReactMarkdown>{annotation.content}</ReactMarkdown>
        </div>
      );
      
    case 'html':
      return (
        <div
          className="html-content prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: annotation.content }}
        />
      );
      
    case 'plain':
    default:
      return (
        <div className="plain-content whitespace-pre-wrap">
          {annotation.content.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      );
  }
};

export default AnnotationRenderer;
