"use client";

import React, { useState } from 'react';
import { useAnnotations } from '@/app/contexts/AnnotationContext';
import RichTextEditor from './RichTextEditor';
import MarkdownEditor from './MarkdownEditor';

interface AnnotationCreatorProps {
  targetId: string;
  targetType: 'entity' | 'event' | 'location';
  onComplete?: () => void;
}

const AnnotationCreator: React.FC<AnnotationCreatorProps> = ({
  targetId,
  targetType,
  onComplete
}) => {
  const { createAnnotation } = useAnnotations();
  const [content, setContent] = useState<string>('');
  const [format, setFormat] = useState<'plain' | 'markdown' | 'html'>('plain');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    createAnnotation(
      targetId,
      targetType,
      content,
      format,
      tags.length > 0 ? tags : undefined
    );
    
    // Reset form
    setContent('');
    setTags([]);
    setTagInput('');
    
    // Notify parent
    if (onComplete) {
      onComplete();
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const renderEditor = () => {
    switch (format) {
      case 'html':
        return (
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        );
      case 'markdown':
        return (
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        );
      case 'plain':
      default:
        return (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border rounded p-3 min-h-[120px]"
            placeholder="Add your annotation here..."
          />
        );
    }
  };
  
  return (
    <form className="annotation-creator border rounded-md p-4 bg-white" onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium mb-3">Add Annotation</h3>
      
      <div className="form-group mb-4">
        <label htmlFor="format" className="block text-sm font-medium mb-1">Format</label>
        <select
          id="format"
          value={format}
          onChange={e => setFormat(e.target.value as any)}
          className="w-full border rounded p-2"
        >
          <option value="plain">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">Rich Text</option>
        </select>
      </div>
      
      <div className="form-group mb-4">
        <label htmlFor="content" className="block text-sm font-medium mb-1">Annotation</label>
        {renderEditor()}
      </div>
      
      <div className="form-group mb-4">
        <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags</label>
        <div className="tag-input-container flex">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            className="flex-grow border rounded-l p-2"
            placeholder="Add tags..."
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim()}
            className="px-3 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-300"
          >
            Add
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="tags-list flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span key={tag} className="tag bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                {tag}
                <button
                  type="button"
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => removeTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-actions flex justify-end">
        <button 
          type="submit" 
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Save Annotation
        </button>
      </div>
    </form>
  );
};

export default AnnotationCreator;
