"use client";

import React, { useState } from 'react';
import { useAnnotations } from '@/app/contexts/AnnotationContext';
import { Annotation } from '@/app/models/annotation-types';
import AnnotationRenderer from '@/app/components/core/annotations/AnnotationRenderer';
import AnnotationEditor from '@/app/components/core/annotations/AnnotationEditor';

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
      <div className="no-annotations text-center p-4 text-gray-500">
        <p>No annotations yet.</p>
      </div>
    );
  }
  
  return (
    <div className="annotation-list space-y-4">
      {annotations.map(annotation => (
        <div key={annotation.id} className="annotation-item border rounded-md overflow-hidden bg-white">
          {editingAnnotation === annotation.id ? (
            <AnnotationEditor
              annotation={annotation}
              onCancel={() => setEditingAnnotation(null)}
              onSave={() => setEditingAnnotation(null)}
            />
          ) : (
            <>
              <div className="annotation-content p-3">
                <AnnotationRenderer annotation={annotation} />
              </div>
              
              <div className="annotation-meta flex justify-between items-center px-3 py-2 bg-gray-50 text-sm">
                <span className="annotation-date text-gray-500">
                  {new Date(annotation.updatedAt).toLocaleString()}
                </span>
                
                <div className="annotation-actions flex space-x-2">
                  <button
                    className="edit-button text-blue-600 hover:text-blue-800"
                    onClick={() => setEditingAnnotation(annotation.id)}
                  >
                    Edit
                  </button>
                  
                  <button
                    className="delete-button text-red-600 hover:text-red-800"
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