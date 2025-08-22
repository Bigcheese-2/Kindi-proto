"use client";

import { useState } from 'react';
import { useAnnotations } from '@/app/contexts/AnnotationContext';
import RichTextEditor from './RichTextEditor';

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
  
  return (
    <form className="annotation-creator space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="format" className="block text-sm font-medium">Format</label>
        <select
          id="format"
          value={format}
          onChange={e => setFormat(e.target.value as any)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="plain">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">Rich Text</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium">Annotation</label>
        {format === 'html' ? (
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="Add your annotation here..."
          />
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium">Tags</label>
        <div className="flex">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="Add tags..."
            className="flex-1 px-3 py-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            Add
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="tags-list flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="tag flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  className="remove-tag ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => removeTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          Save Annotation
        </button>
      </div>
    </form>
  );
};

export default AnnotationCreator;
