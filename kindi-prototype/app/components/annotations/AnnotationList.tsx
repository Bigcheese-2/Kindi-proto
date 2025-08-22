"use client";

import { useState } from 'react';
import { useAnnotations } from '@/app/contexts/AnnotationContext';
import AnnotationRenderer from './AnnotationRenderer';
import AnnotationEditor from './AnnotationEditor';

interface AnnotationListProps {
  targetId: string;
  targetType: 'entity' | 'event' | 'location';
}

const AnnotationList: React.FC<AnnotationListProps> = ({
  targetId,
  targetType
}) => {
  const { getAnnotationsForTarget, deleteAnnotation } = useAnnotations();
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null);
  
  const annotations = getAnnotationsForTarget(targetId, targetType);
  
  if (annotations.length === 0) {
    return (
      <div className="no-annotations text-center py-6 text-gray-500 dark:text-gray-400">
        <p>No annotations yet.</p>
      </div>
    );
  }
  
  return (
    <div className="annotation-list space-y-4">
      {annotations.map(annotation => (
        <div 
          key={annotation.id} 
          className="annotation-item border dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800"
        >
          {editingAnnotation === annotation.id ? (
            <AnnotationEditor
              annotation={annotation}
              onCancel={() => setEditingAnnotation(null)}
              onSave={() => setEditingAnnotation(null)}
            />
          ) : (
            <>
              <div className="annotation-content mb-3">
                <AnnotationRenderer annotation={annotation} />
              </div>
              
              <div className="annotation-meta flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="annotation-date">
                    {new Date(annotation.updatedAt).toLocaleString()}
                  </span>
                  
                  {annotation.tags && annotation.tags.length > 0 && (
                    <div className="annotation-tags flex flex-wrap gap-1">
                      {annotation.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="annotation-actions flex space-x-2">
                  <button
                    className="edit-button text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setEditingAnnotation(annotation.id)}
                  >
                    Edit
                  </button>
                  
                  <button
                    className="delete-button text-red-600 dark:text-red-400 hover:underline"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this annotation?')) {
                        deleteAnnotation(annotation.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnotationList;
